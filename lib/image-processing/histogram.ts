import { blankLike, luminance } from "./canvas-utils";
import type { HistogramData } from "@/types/image";

export function computeHistogram(src: ImageData): HistogramData {
  const red = new Array(256).fill(0);
  const green = new Array(256).fill(0);
  const blue = new Array(256).fill(0);
  const lum = new Array(256).fill(0);

  const { data } = src;
  for (let i = 0; i < data.length; i += 4) {
    red[data[i]]++;
    green[data[i + 1]]++;
    blue[data[i + 2]]++;
    lum[Math.round(luminance(data[i], data[i + 1], data[i + 2]))]++;
  }
  return { red, green, blue, luminance: lum };
}

// Renders the luminance histogram as an ImageData for display in the main canvas.
// Amber bars on dark background, faint grid lines at 64/128/192 intensity.
export function renderHistogramAsImageData(src: ImageData): ImageData {
  const W = 512, H = 256;
  const dst = new ImageData(W, H);

  // Dark background
  for (let i = 0; i < dst.data.length; i += 4) {
    dst.data[i] = 10; dst.data[i + 1] = 10; dst.data[i + 2] = 11; dst.data[i + 3] = 255;
  }

  // Compute luminance histogram
  const hist = new Float32Array(256);
  const { data } = src;
  for (let i = 0; i < data.length; i += 4) {
    hist[Math.round(luminance(data[i], data[i + 1], data[i + 2]))]++;
  }
  const maxCount = Math.max(...hist, 1);

  // Faint vertical grid at 64, 128, 192
  for (const gv of [64, 128, 192]) {
    const gx = Math.round((gv / 255) * (W - 1));
    for (let y = 0; y < H; y++) {
      const idx = (y * W + gx) * 4;
      dst.data[idx] = dst.data[idx + 1] = dst.data[idx + 2] = 38;
    }
  }
  // Faint horizontal grid at 50%
  const gy = Math.floor(H * 0.5);
  for (let x = 0; x < W; x++) {
    const idx = (gy * W + x) * 4;
    dst.data[idx] = dst.data[idx + 1] = dst.data[idx + 2] = 38;
  }

  // Amber bars
  const barW = W / 256;
  for (let b = 0; b < 256; b++) {
    const barH = Math.round((hist[b] / maxCount) * H);
    const x0 = Math.floor(b * barW);
    const x1 = Math.max(x0 + 1, Math.floor((b + 1) * barW));
    for (let y = H - barH; y < H; y++) {
      for (let x = x0; x < x1 && x < W; x++) {
        const idx = (y * W + x) * 4;
        dst.data[idx] = 255; dst.data[idx + 1] = 170; dst.data[idx + 2] = 0; dst.data[idx + 3] = 255;
      }
    }
  }

  return dst;
}

export function applyHistogramEqualization(src: ImageData): ImageData {
  const { data, width, height } = src;
  const total = width * height;

  // Compute luminance histogram
  const hist = new Array(256).fill(0);
  const grayPixels = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const g = Math.round(luminance(data[idx], data[idx + 1], data[idx + 2]));
    grayPixels[i] = g;
    hist[g]++;
  }

  // CDF
  const cdf = new Array(256).fill(0);
  cdf[0] = hist[0];
  for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i];

  // Find cdf_min (first non-zero)
  const cdfMin = cdf.find((v) => v > 0) ?? 0;

  // Build mapping
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(((cdf[i] - cdfMin) / (total - cdfMin)) * 255);
  }

  // Apply: convert original to grayscale with equalized mapping
  const dst = blankLike(src);
  for (let i = 0; i < total; i++) {
    const mapped = lut[grayPixels[i]];
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = mapped;
    dst.data[outIdx + 3] = 255;
  }
  return dst;
}

export function applyHistogramStretch(src: ImageData): ImageData {
  // Find the actual min and max luminance in the image, then map to [0, 255].
  // Different from equalization: this is linear, equalization is CDF-based.
  const { data, width, height } = src;
  const total = width * height;

  let minL = 255, maxL = 0;
  const lumArr = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const l = Math.round(luminance(data[idx], data[idx + 1], data[idx + 2]));
    lumArr[i] = l;
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;
  }

  const range = maxL - minL;
  const dst = blankLike(src);
  if (range === 0) return dst;

  for (let i = 0; i < total; i++) {
    const stretched = Math.round(((lumArr[i] - minL) / range) * 255);
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = stretched;
    dst.data[outIdx + 3] = 255;
  }
  return dst;
}
