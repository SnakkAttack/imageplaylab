// Thresholding: converts grayscale to binary (black/white) images.
// Otsu's method is the interesting one, it finds the optimal threshold
// automatically by maximizing the inter-class variance between foreground and background.
// Gage

import { blankLike, luminance } from "./canvas-utils";

function toGrayArray(src: ImageData): Uint8Array {
  const gray = new Uint8Array(src.width * src.height);
  for (let i = 0; i < gray.length; i++) {
    const idx = i * 4;
    gray[i] = Math.round(luminance(src.data[idx], src.data[idx + 1], src.data[idx + 2]));
  }
  return gray;
}

export function applyManualThreshold(src: ImageData, threshold: number): ImageData {
  const gray = toGrayArray(src);
  const dst  = blankLike(src);
  for (let i = 0; i < gray.length; i++) {
    const val = gray[i] > threshold ? 255 : 0;
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = val;
    dst.data[outIdx + 3] = 255;
  }
  return dst;
}

export function applyInverseThreshold(src: ImageData, threshold: number): ImageData {
  const gray = toGrayArray(src);
  const dst  = blankLike(src);
  for (let i = 0; i < gray.length; i++) {
    const val = gray[i] > threshold ? 0 : 255;
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = val;
    dst.data[outIdx + 3] = 255;
  }
  return dst;
}

/**
 * Otsu's method: sweep all possible thresholds 0-254 and pick the one that
 * maximizes inter-class variance (= variance between the two pixel groups).
 * Returns the optimal threshold and the resulting binary ImageData.
 */
export function applyOtsuThreshold(src: ImageData): { imageData: ImageData; threshold: number } {
  const gray  = toGrayArray(src);
  const total = gray.length;

  // Build normalized intensity histogram
  const hist = new Float32Array(256);
  for (const v of gray) hist[v]++;
  const prob = hist.map((h) => h / total);

  // Precompute total mean so we can derive foreground mean without a second loop
  const totalMean = prob.reduce((acc, p, i) => acc + p * i, 0);

  let bestThreshold = 0;
  let maxVariance   = 0;
  let cumProb = 0;
  let cumMean = 0;

  for (let t = 0; t < 255; t++) {
    cumProb += prob[t];
    cumMean += t * prob[t];
    if (cumProb === 0 || cumProb === 1) continue;

    const bgMean   = cumMean / cumProb;
    const fgMean   = (totalMean - cumMean) / (1 - cumProb);
    const variance = cumProb * (1 - cumProb) * (bgMean - fgMean) ** 2;

    if (variance > maxVariance) {
      maxVariance   = variance;
      bestThreshold = t;
    }
  }

  const dst = blankLike(src);
  for (let i = 0; i < gray.length; i++) {
    const val    = gray[i] > bestThreshold ? 255 : 0;
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = val;
    dst.data[outIdx + 3] = 255;
  }
  return { imageData: dst, threshold: bestThreshold };
}
