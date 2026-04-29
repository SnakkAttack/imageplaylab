import { cloneImageData, blankLike, luminance } from "./canvas-utils";

export function applyGrayscale(src: ImageData): ImageData {
  const dst = cloneImageData(src);
  const { data } = dst;
  for (let i = 0; i < data.length; i += 4) {
    const g = Math.round(luminance(data[i], data[i + 1], data[i + 2]));
    data[i] = data[i + 1] = data[i + 2] = g;
  }
  return dst;
}

export function applyRedChannel(src: ImageData): ImageData {
  const dst = blankLike(src);
  const { data } = src;
  for (let i = 0; i < data.length; i += 4) {
    dst.data[i]     = data[i];
    dst.data[i + 1] = 0;
    dst.data[i + 2] = 0;
    dst.data[i + 3] = 255;
  }
  return dst;
}

export function applyGreenChannel(src: ImageData): ImageData {
  const dst = blankLike(src);
  const { data } = src;
  for (let i = 0; i < data.length; i += 4) {
    dst.data[i]     = 0;
    dst.data[i + 1] = data[i + 1];
    dst.data[i + 2] = 0;
    dst.data[i + 3] = 255;
  }
  return dst;
}

export function applyBlueChannel(src: ImageData): ImageData {
  const dst = blankLike(src);
  const { data } = src;
  for (let i = 0; i < data.length; i += 4) {
    dst.data[i]     = 0;
    dst.data[i + 1] = 0;
    dst.data[i + 2] = data[i + 2];
    dst.data[i + 3] = 255;
  }
  return dst;
}
