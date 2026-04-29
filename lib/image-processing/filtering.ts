import { blankLike, clamp255, luminance } from "./canvas-utils";

/** Apply a linear convolution kernel to one channel across the full image. */
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

/** Build a k×k uniform (box) kernel that sums to 1. */
function buildBoxKernel(k: number): number[][] {
  const val = 1 / (k * k);
  return Array.from({ length: k }, () => Array(k).fill(val));
}

/** Build a k×k Gaussian kernel with the given sigma. */
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

// Export kernel builders for use in edge detection
export { buildGaussianKernel };
