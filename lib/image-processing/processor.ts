// Central operation router. LabShell calls this with the active module/op/params
// and gets back a processed ImageData. All the actual algorithm logic lives in
// the individual module files; this just dispatches to the right one.
// Gage

import type { ActiveOperation } from "@/types/image";
import { cloneImageData } from "./canvas-utils";
import { applyGrayscale, applyRedChannel, applyGreenChannel, applyBlueChannel } from "./basics";
import { applyGaussianNoise, applySaltAndPepperNoise, applyUniformNoise } from "./noise";
import { applyMeanBlur, applyGaussianBlur, applyMedianFilter } from "./filtering";
import { applySobel, applyLaplacian, applyCanny } from "./edge-detection";
import { applyManualThreshold, applyInverseThreshold, applyOtsuThreshold } from "./thresholding";
import { applyHistogramEqualization } from "./histogram";
import { applyErosion, applyDilation, applyOpening, applyClosing } from "./morphology";

export function processImage(src: ImageData, operation: ActiveOperation): ImageData {
  const { moduleId, operationId, params } = operation;

  switch (moduleId) {
    case "basics":
      switch (operationId) {
        case "original":      return cloneImageData(src);
        case "grayscale":     return applyGrayscale(src);
        case "channel_red":   return applyRedChannel(src);
        case "channel_green": return applyGreenChannel(src);
        case "channel_blue":  return applyBlueChannel(src);
      }
      break;

    case "noise":
      switch (operationId) {
        case "gaussian_noise": return applyGaussianNoise(src, Number(params.sigma));
        case "salt_pepper":    return applySaltAndPepperNoise(src, Number(params.probability));
        case "uniform_noise":  return applyUniformNoise(src, Number(params.intensity));
      }
      break;

    case "filtering":
      switch (operationId) {
        case "mean_blur":     return applyMeanBlur(src, Number(params.kernelSize));
        case "gaussian_blur": return applyGaussianBlur(src, Number(params.kernelSize), Number(params.sigma));
        case "median_filter": return applyMedianFilter(src, Number(params.kernelSize));
      }
      break;

    case "edges":
      switch (operationId) {
        case "sobel":     return applySobel(src, Number(params.scale));
        case "laplacian": return applyLaplacian(src, Number(params.scale));
        case "canny":     return applyCanny(src, Number(params.lowThreshold), Number(params.highThreshold));
      }
      break;

    case "threshold":
      switch (operationId) {
        case "manual_threshold":  return applyManualThreshold(src, Number(params.threshold));
        case "inverse_threshold": return applyInverseThreshold(src, Number(params.threshold));
        case "otsu": {
          // Otsu returns both the image and the computed threshold value;
          // LabShell handles the threshold display separately
          const { imageData } = applyOtsuThreshold(src);
          return imageData;
        }
      }
      break;

    case "histogram":
      switch (operationId) {
        case "histogram_view":         return cloneImageData(src);
        case "histogram_equalization": return applyHistogramEqualization(src);
      }
      break;

    case "morphology":
      switch (operationId) {
        case "erosion":  return applyErosion(src, Number(params.kernelSize));
        case "dilation": return applyDilation(src, Number(params.kernelSize));
        case "opening":  return applyOpening(src, Number(params.kernelSize));
        case "closing":  return applyClosing(src, Number(params.kernelSize));
      }
      break;

    case "metrics":
      // metrics_view just shows stats on the original; no image transform needed
      return cloneImageData(src);
  }

  // fallback: shouldn't hit this if MODULE_DEFS stays in sync with cases above
  return cloneImageData(src);
}
