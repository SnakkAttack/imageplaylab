import { blankLike, luminance } from "./canvas-utils";

// convert to binary (0 or 255) so morphological ops work on clean black/white regions
function toBinaryGray(src: ImageData): Uint8Array {
  const binary = new Uint8Array(src.width * src.height);
  for (let i = 0; i < binary.length; i++) {
    const idx = i * 4;
    binary[i] = luminance(src.data[idx], src.data[idx + 1], src.data[idx + 2]) > 127 ? 255 : 0;
  }
  return binary;
}

function applyErosionRaw(binary: Uint8Array, width: number, height: number, half: number): Uint8Array {
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let isMin = true;
      outer: for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx));
          const sy = Math.min(height - 1, Math.max(0, y + ky));
          if (binary[sy * width + sx] === 0) { isMin = false; break outer; }
        }
      }
      out[y * width + x] = isMin ? 255 : 0;
    }
  }
  return out;
}

function applyDilationRaw(binary: Uint8Array, width: number, height: number, half: number): Uint8Array {
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let isMax = false;
      outer: for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx));
          const sy = Math.min(height - 1, Math.max(0, y + ky));
          if (binary[sy * width + sx] === 255) { isMax = true; break outer; }
        }
      }
      out[y * width + x] = isMax ? 255 : 0;
    }
  }
  return out;
}

function binaryToImageData(binary: Uint8Array, width: number, height: number): ImageData {
  const dst = new ImageData(width, height);
  for (let i = 0; i < binary.length; i++) {
    const outIdx = i * 4;
    dst.data[outIdx] = dst.data[outIdx + 1] = dst.data[outIdx + 2] = binary[i];
    dst.data[outIdx + 3] = 255;
  }
  return dst;
}

export function applyErosion(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const binary = toBinaryGray(src);
  const out = applyErosionRaw(binary, src.width, src.height, half);
  return binaryToImageData(out, src.width, src.height);
}

export function applyDilation(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const binary = toBinaryGray(src);
  const out = applyDilationRaw(binary, src.width, src.height, half);
  return binaryToImageData(out, src.width, src.height);
}

// opening = erosion then dilation, removes small bright specs
export function applyOpening(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const binary = toBinaryGray(src);
  const eroded = applyErosionRaw(binary, src.width, src.height, half);
  const opened = applyDilationRaw(eroded, src.width, src.height, half);
  return binaryToImageData(opened, src.width, src.height);
}

// closing = dilation then erosion, fills small dark holes
export function applyClosing(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const binary = toBinaryGray(src);
  const dilated = applyDilationRaw(binary, src.width, src.height, half);
  const closed = applyErosionRaw(dilated, src.width, src.height, half);
  return binaryToImageData(closed, src.width, src.height);
}

// gradient = dilation minus erosion, gives the outline of binary regions
export function applyMorphGradient(src: ImageData, kernelSize: number): ImageData {
  const k = Math.max(3, kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize);
  const half = Math.floor(k / 2);
  const binary = toBinaryGray(src);
  const dilated = applyDilationRaw(binary, src.width, src.height, half);
  const eroded  = applyErosionRaw(binary, src.width, src.height, half);
  const grad = new Uint8Array(src.width * src.height);
  for (let i = 0; i < grad.length; i++) {
    grad[i] = dilated[i] - eroded[i];
  }
  return binaryToImageData(grad, src.width, src.height);
}
