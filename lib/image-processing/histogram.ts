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
