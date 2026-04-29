// Image quality metrics: MSE, PSNR, and SSIM.
// These let us quantify how much an operation distorts the original image.
// All computed over RGB channels only (alpha is ignored).
// Gage

import type { ImageMetrics } from "@/types/image";

export function computeMetrics(original: ImageData, processed: ImageData): ImageMetrics {
  const n = original.width * original.height;
  let mseSum = 0;

  for (let i = 0; i < n; i++) {
    const idx = i * 4;
    for (let c = 0; c < 3; c++) {
      const diff = original.data[idx + c] - processed.data[idx + c];
      mseSum += diff * diff;
    }
  }

  // Average squared error per channel per pixel
  const mse = mseSum / (n * 3);

  // PSNR = 10 * log10(MAX^2 / MSE). MAX is 255 for 8-bit.
  // Returns Infinity when images are identical (MSE = 0).
  const psnr = mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);

  const ssim = computeSSIM(original, processed);

  return { mse, psnr, ssim };
}

// Full windowed SSIM is too slow in JS; this global-stats version is a reasonable approximation.
// Uses the same three components as the original paper (luminance, contrast, structure)
// but computed over the whole image instead of local 8x8 windows.
function computeSSIM(a: ImageData, b: ImageData): number {
  const n = a.width * a.height * 3;
  let meanA = 0, meanB = 0;

  for (let i = 0; i < a.width * a.height; i++) {
    const idx = i * 4;
    for (let c = 0; c < 3; c++) {
      meanA += a.data[idx + c];
      meanB += b.data[idx + c];
    }
  }
  meanA /= n;
  meanB /= n;

  let varA = 0, varB = 0, covAB = 0;
  for (let i = 0; i < a.width * a.height; i++) {
    const idx = i * 4;
    for (let c = 0; c < 3; c++) {
      const da = a.data[idx + c] - meanA;
      const db = b.data[idx + c] - meanB;
      varA  += da * da;
      varB  += db * db;
      covAB += da * db;
    }
  }
  varA  /= n;
  varB  /= n;
  covAB /= n;

  // Stability constants from the original SSIM paper (Wang et al. 2004)
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;

  const ssim =
    ((2 * meanA * meanB + C1) * (2 * covAB + C2)) /
    ((meanA ** 2 + meanB ** 2 + C1) * (varA + varB + C2));

  return Math.max(0, Math.min(1, ssim));
}
