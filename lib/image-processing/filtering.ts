import { blankLike, clamp255, luminance } from "./canvas-utils";

// apply a 2D kernel to one color channel, returns a float array
function convolve(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: number[][],
  channelOffset: 0 | 1 | 2
): Float32Array {
  const kSize = kernel.length;
  const half = Math.floor(kSize / 2);
  const out = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let ky = 0; ky < kSize; ky++) {
        for (let kx = 0; kx < kSize; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx - half));
          const sy = Math.min(height - 1, Math.max(0, y + ky - half));
          sum += kernel[ky][kx] * src[(sy * width + sx) * 4 + channelOffset];
        }
      }
      out[y * width + x] = sum;
    }
  }
  return out;
}

// box kernel: every weight is 1/(k*k), sums to 1
function buildBoxKernel(k: number): number[][] {
  const val = 1 / (k * k);
  return Array.from({ length: k }, () => Array(k).fill(val));
}

// Gaussian kernel: weights fall off by distance from center based on sigma
function buildGaussianKernel(k: number, sigma: number): number[][] {
  const half = Math.floor(k / 2);
  let sum = 0;
  const kernel: number[][] = [];
  for (let y = 0; y < k; y++) {
    kernel[y] = [];
    for (let x = 0; x < k; x++) {
      const dx = x - half, dy = y - half;
      const val = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
      kernel[y][x] = val;
      sum += val;
    }
  }
  // Normalize
  for (let y = 0; y < k; y++)
    for (let x = 0; x < k; x++)
      kernel[y][x] /= sum;
  return kernel;
}

export function applyMeanBlur(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const kernel = buildBoxKernel(k);
  const dst = blankLike(src);
  const { data, width, height } = src;

  for (const ch of [0, 1, 2] as const) {
    const out = convolve(data, width, height, kernel, ch);
    for (let i = 0; i < width * height; i++) {
      dst.data[i * 4 + ch] = clamp255(out[i]);
    }
  }
  // Copy alpha
  for (let i = 0; i < width * height; i++) dst.data[i * 4 + 3] = data[i * 4 + 3];
  return dst;
}

export function applyGaussianBlur(src: ImageData, kernelSize: number, sigma: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const kernel = buildGaussianKernel(k, sigma);
  const dst = blankLike(src);
  const { data, width, height } = src;

  for (const ch of [0, 1, 2] as const) {
    const out = convolve(data, width, height, kernel, ch);
    for (let i = 0; i < width * height; i++) {
      dst.data[i * 4 + ch] = clamp255(out[i]);
    }
  }
  for (let i = 0; i < width * height; i++) dst.data[i * 4 + 3] = data[i * 4 + 3];
  return dst;
}

export function applyMedianFilter(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const { data, width, height } = src;
  const dst = blankLike(src);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rArr: number[] = [], gArr: number[] = [], bArr: number[] = [];
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx));
          const sy = Math.min(height - 1, Math.max(0, y + ky));
          const idx = (sy * width + sx) * 4;
          rArr.push(data[idx]);
          gArr.push(data[idx + 1]);
          bArr.push(data[idx + 2]);
        }
      }
      rArr.sort((a, b) => a - b);
      gArr.sort((a, b) => a - b);
      bArr.sort((a, b) => a - b);
      const mid = Math.floor(rArr.length / 2);
      const outIdx = (y * width + x) * 4;
      dst.data[outIdx]     = rArr[mid];
      dst.data[outIdx + 1] = gArr[mid];
      dst.data[outIdx + 2] = bArr[mid];
      dst.data[outIdx + 3] = data[outIdx + 3];
    }
  }
  return dst;
}

export function applyBilateralFilter(
  src: ImageData,
  kernelSize: number,
  sigmaSpace: number,
  sigmaColor: number
): ImageData {
  // Bilateral = Gaussian weighted by both spatial distance and color difference.
  // Edges stay sharp because pixels across an edge have high color distance, so low weight.
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const { data, width, height } = src;
  const dst = blankLike(src);

  const twoSigmaSpaceSq = 2 * sigmaSpace * sigmaSpace;
  const twoSigmaColorSq = 2 * sigmaColor * sigmaColor;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cIdx = (y * width + x) * 4;
      let sumR = 0, sumG = 0, sumB = 0, sumW = 0;

      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx));
          const sy = Math.min(height - 1, Math.max(0, y + ky));
          const nIdx = (sy * width + sx) * 4;

          const spatialW = Math.exp(-(kx * kx + ky * ky) / twoSigmaSpaceSq);
          const dR = data[nIdx] - data[cIdx];
          const dG = data[nIdx + 1] - data[cIdx + 1];
          const dB = data[nIdx + 2] - data[cIdx + 2];
          const colorW = Math.exp(-(dR * dR + dG * dG + dB * dB) / twoSigmaColorSq);

          const w = spatialW * colorW;
          sumR += data[nIdx]     * w;
          sumG += data[nIdx + 1] * w;
          sumB += data[nIdx + 2] * w;
          sumW += w;
        }
      }

      const outIdx = (y * width + x) * 4;
      dst.data[outIdx]     = clamp255(sumR / sumW);
      dst.data[outIdx + 1] = clamp255(sumG / sumW);
      dst.data[outIdx + 2] = clamp255(sumB / sumW);
      dst.data[outIdx + 3] = data[outIdx + 3];
    }
  }
  return dst;
}

export function applySharpen(src: ImageData, amount: number): ImageData {
  // Unsharp mask: add back a scaled version of (original - blurred)
  const blurred = applyGaussianBlur(src, 5, 1.0);
  const dst = blankLike(src);
  const { data, width, height } = src;

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    for (let ch = 0; ch < 3; ch++) {
      dst.data[idx + ch] = clamp255(
        data[idx + ch] + amount * (data[idx + ch] - blurred.data[idx + ch])
      );
    }
    dst.data[idx + 3] = data[idx + 3];
  }
  return dst;
}

export function applyEmboss(src: ImageData, scale: number): ImageData {
  // Diagonal kernel gives a 3D relief look, bias output to 128 so flat areas are mid-gray
  const kernel = [
    [-2, -1, 0],
    [-1,  1, 1],
    [ 0,  1, 2],
  ];
  const { data, width, height } = src;
  const dst = blankLike(src);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx - 1));
          const sy = Math.min(height - 1, Math.max(0, y + ky - 1));
          const idx = (sy * width + sx) * 4;
          sum += kernel[ky][kx] * luminance(data[idx], data[idx + 1], data[idx + 2]);
        }
      }
      const val = clamp255(sum * scale + 128);
      const outIdx = (y * width + x) * 4;
      dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = val;
      dst.data[outIdx + 3] = 255;
    }
  }
  return dst;
}

// Export kernel builders for use in edge detection
export { buildGaussianKernel };
