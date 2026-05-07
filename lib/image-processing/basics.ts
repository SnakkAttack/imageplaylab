import { cloneImageData, blankLike, clamp255, luminance } from "./canvas-utils";

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

export function applyBrightness(src: ImageData, amount: number): ImageData {
  const dst = cloneImageData(src);
  const { data } = dst;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = clamp255(data[i]     + amount);
    data[i + 1] = clamp255(data[i + 1] + amount);
    data[i + 2] = clamp255(data[i + 2] + amount);
  }
  return dst;
}

export function applyContrast(src: ImageData, factor: number): ImageData {
  const dst = cloneImageData(src);
  const { data } = dst;
  // Pivot around 128 so a factor of 1.0 is a no-op
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = clamp255(factor * (data[i]     - 128) + 128);
    data[i + 1] = clamp255(factor * (data[i + 1] - 128) + 128);
    data[i + 2] = clamp255(factor * (data[i + 2] - 128) + 128);
  }
  return dst;
}

export function applyInvert(src: ImageData): ImageData {
  const dst = cloneImageData(src);
  const { data } = dst;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return dst;
}

export function applySepia(src: ImageData): ImageData {
  const dst = cloneImageData(src);
  const { data } = dst;
  // Standard sepia coefficients from the ITU recommendation
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i]     = clamp255(r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = clamp255(r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = clamp255(r * 0.272 + g * 0.534 + b * 0.131);
  }
  return dst;
}

export function applyGamma(src: ImageData, gamma: number): ImageData {
  // LUT so we don't call Math.pow on every pixel
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(Math.pow(i / 255, 1 / gamma) * 255);
  }
  const dst = cloneImageData(src);
  const { data } = dst;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = lut[data[i]];
    data[i + 1] = lut[data[i + 1]];
    data[i + 2] = lut[data[i + 2]];
  }
  return dst;
}
