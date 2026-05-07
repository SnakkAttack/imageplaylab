// Edge detection: Sobel, Laplacian, Prewitt, Scharr, and the full Canny pipeline.
// Canny was by far the hardest to implement from scratch, had to carefully follow
// the original Canny (1986) paper for NMS and hysteresis to get clean edges.
// Gage

import { blankLike, clamp255, luminance } from "./canvas-utils";

// Convert ImageData to a single-channel float grayscale array for processing
function toGray(src: ImageData): Float32Array {
  const gray = new Float32Array(src.width * src.height);
  for (let i = 0; i < gray.length; i++) {
    const idx = i * 4;
    gray[i] = luminance(src.data[idx], src.data[idx + 1], src.data[idx + 2]);
  }
  return gray;
}

// Zero-pad boundary helper: returns 0 for out-of-bounds coords instead of wrapping
function at(arr: Float32Array, x: number, y: number, w: number, h: number): number {
  if (x < 0 || x >= w || y < 0 || y >= h) return 0;
  return arr[y * w + x];
}

export function applySobel(src: ImageData, scale: number): ImageData {
  const { width, height } = src;
  const gray = toGray(src);
  const dst = blankLike(src);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 3x3 Sobel kernels for horizontal and vertical gradients
      const gx =
        -at(gray, x - 1, y - 1, width, height) + at(gray, x + 1, y - 1, width, height) +
        -2 * at(gray, x - 1, y, width, height)  + 2 * at(gray, x + 1, y, width, height) +
        -at(gray, x - 1, y + 1, width, height) + at(gray, x + 1, y + 1, width, height);

      const gy =
        -at(gray, x - 1, y - 1, width, height) - 2 * at(gray, x, y - 1, width, height) - at(gray, x + 1, y - 1, width, height) +
         at(gray, x - 1, y + 1, width, height) + 2 * at(gray, x, y + 1, width, height) + at(gray, x + 1, y + 1, width, height);

      const mag = clamp255(Math.sqrt(gx * gx + gy * gy) * scale);
      const outIdx = (y * width + x) * 4;
      dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = mag;
      dst.data[outIdx + 3] = 255;
    }
  }
  return dst;
}

export function applyLaplacian(src: ImageData, scale: number): ImageData {
  const { width, height } = src;
  const gray = toGray(src);
  const dst = blankLike(src);

  // 4-connected discrete Laplacian: highlights regions of rapid intensity change
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const lap =
        at(gray, x, y - 1, width, height) +
        at(gray, x - 1, y, width, height) - 4 * at(gray, x, y, width, height) + at(gray, x + 1, y, width, height) +
        at(gray, x, y + 1, width, height);
      const val = clamp255(Math.abs(lap) * scale);
      const outIdx = (y * width + x) * 4;
      dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = val;
      dst.data[outIdx + 3] = 255;
    }
  }
  return dst;
}

export function applyPrewitt(src: ImageData, scale: number): ImageData {
  const { width, height } = src;
  const gray = toGray(src);
  const dst = blankLike(src);

  // Prewitt is like Sobel but without the 2x center weighting, simpler kernel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx =
        -at(gray, x - 1, y - 1, width, height) + at(gray, x + 1, y - 1, width, height) +
        -at(gray, x - 1, y,     width, height)  + at(gray, x + 1, y,     width, height) +
        -at(gray, x - 1, y + 1, width, height) + at(gray, x + 1, y + 1, width, height);

      const gy =
        -at(gray, x - 1, y - 1, width, height) - at(gray, x, y - 1, width, height) - at(gray, x + 1, y - 1, width, height) +
         at(gray, x - 1, y + 1, width, height) + at(gray, x, y + 1, width, height) + at(gray, x + 1, y + 1, width, height);

      const mag = clamp255(Math.sqrt(gx * gx + gy * gy) * scale);
      const outIdx = (y * width + x) * 4;
      dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = mag;
      dst.data[outIdx + 3] = 255;
    }
  }
  return dst;
}

export function applyScharr(src: ImageData, scale: number): ImageData {
  const { width, height } = src;
  const gray = toGray(src);
  const dst = blankLike(src);

  // Scharr has better rotational symmetry than Sobel, useful when angle accuracy matters.
  // Values are ~10x larger so we scale down by 0.1 to keep output in the same visual range.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx =
        -3  * at(gray, x - 1, y - 1, width, height) + 3  * at(gray, x + 1, y - 1, width, height) +
        -10 * at(gray, x - 1, y,     width, height)  + 10 * at(gray, x + 1, y,     width, height) +
        -3  * at(gray, x - 1, y + 1, width, height) + 3  * at(gray, x + 1, y + 1, width, height);

      const gy =
        -3  * at(gray, x - 1, y - 1, width, height) - 10 * at(gray, x, y - 1, width, height) - 3  * at(gray, x + 1, y - 1, width, height) +
         3  * at(gray, x - 1, y + 1, width, height) + 10 * at(gray, x, y + 1, width, height) + 3  * at(gray, x + 1, y + 1, width, height);

      const mag = clamp255(Math.sqrt(gx * gx + gy * gy) * scale * 0.1);
      const outIdx = (y * width + x) * 4;
      dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = mag;
      dst.data[outIdx + 3] = 255;
    }
  }
  return dst;
}

// Separable 1D Gaussian blur on a Float32Array (faster than 2D convolution)
function gaussianBlurGray(gray: Float32Array, width: number, height: number, sigma: number): Float32Array {
  const radius = Math.ceil(sigma * 3);
  const kernel: number[] = [];
  let kSum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(v);
    kSum += v;
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= kSum;

  const tmp = new Float32Array(width * height);
  const out = new Float32Array(width * height);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = 0; k < kernel.length; k++) {
        const sx = Math.min(width - 1, Math.max(0, x + k - radius));
        sum += kernel[k] * gray[y * width + sx];
      }
      tmp[y * width + x] = sum;
    }
  }
  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = 0; k < kernel.length; k++) {
        const sy = Math.min(height - 1, Math.max(0, y + k - radius));
        sum += kernel[k] * tmp[sy * width + x];
      }
      out[y * width + x] = sum;
    }
  }
  return out;
}

// Full Canny pipeline: smooth -> Sobel gradients -> NMS -> hysteresis thresholding
export function applyCanny(src: ImageData, lowThreshold: number, highThreshold: number): ImageData {
  const { width, height } = src;
  const gray = toGray(src);

  // Step 1: Gaussian smooth to suppress noise before gradient computation
  const smoothed = gaussianBlurGray(gray, width, height, 1.4);

  // Step 2: Sobel gradients to get magnitude and direction at every pixel
  const mag   = new Float32Array(width * height);
  const angle = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx =
        -at(smoothed, x - 1, y - 1, width, height) + at(smoothed, x + 1, y - 1, width, height) +
        -2 * at(smoothed, x - 1, y, width, height)  + 2 * at(smoothed, x + 1, y, width, height) +
        -at(smoothed, x - 1, y + 1, width, height) + at(smoothed, x + 1, y + 1, width, height);
      const gy =
        -at(smoothed, x - 1, y - 1, width, height) - 2 * at(smoothed, x, y - 1, width, height) - at(smoothed, x + 1, y - 1, width, height) +
         at(smoothed, x - 1, y + 1, width, height) + 2 * at(smoothed, x, y + 1, width, height) + at(smoothed, x + 1, y + 1, width, height);
      mag[y * width + x]   = Math.sqrt(gx * gx + gy * gy);
      angle[y * width + x] = Math.atan2(gy, gx);
    }
  }

  // Step 3: Non-maximum suppression, keep only local gradient maxima along the edge direction
  const nms = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Quantize angle to 4 directions (0, 45, 90, 135 degrees)
      const theta = ((angle[y * width + x] * 180) / Math.PI + 180) % 180;
      const m = mag[y * width + x];
      let m1 = 0, m2 = 0;
      if (theta < 22.5 || theta >= 157.5) {
        m1 = mag[y * width + x - 1]; m2 = mag[y * width + x + 1];
      } else if (theta < 67.5) {
        m1 = mag[(y - 1) * width + x + 1]; m2 = mag[(y + 1) * width + x - 1];
      } else if (theta < 112.5) {
        m1 = mag[(y - 1) * width + x]; m2 = mag[(y + 1) * width + x];
      } else {
        m1 = mag[(y - 1) * width + x - 1]; m2 = mag[(y + 1) * width + x + 1];
      }
      nms[y * width + x] = m >= m1 && m >= m2 ? m : 0;
    }
  }

  // Step 4: Hysteresis thresholding, strong edges are definite, weak edges only
  // survive if they are connected (8-neighbor) to a strong edge
  const STRONG = 255, WEAK = 75;
  const edges = new Uint8Array(width * height);
  for (let i = 0; i < edges.length; i++) {
    if (nms[i] >= highThreshold)      edges[i] = STRONG;
    else if (nms[i] >= lowThreshold)  edges[i] = WEAK;
  }

  // BFS flood-fill from every strong edge pixel.
  // A single scan-line pass misses weak→strong connections that point right/down,
  // which causes the dotted-line artifact. BFS handles all directions correctly.
  const queue: number[] = [];
  for (let i = 0; i < edges.length; i++) {
    if (edges[i] === STRONG) queue.push(i);
  }
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const cy = Math.floor(idx / width);
    const cx = idx % width;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        const ny = cy + dy, nx = cx + dx;
        if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;
        const ni = ny * width + nx;
        if (edges[ni] === WEAK) {
          edges[ni] = STRONG;
          queue.push(ni);
        }
      }
    }
  }
  // Suppress any weak edges that never connected to a strong edge
  for (let i = 0; i < edges.length; i++) {
    if (edges[i] === WEAK) edges[i] = 0;
  }

  const dst = blankLike(src);
  for (let i = 0; i < edges.length; i++) {
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = edges[i];
    dst.data[outIdx + 3] = 255;
  }
  return dst;
}
