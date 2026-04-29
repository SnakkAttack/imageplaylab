/**
 * Shared canvas utilities for creating, reading, and writing ImageData.
 */

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function canvasToImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext("2d")!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function cloneImageData(src: ImageData): ImageData {
  const dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  return dst;
}

/** Create a blank ImageData of the same size. */
export function blankLike(src: ImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(src.width * src.height * 4), src.width, src.height);
}

/** Read a pixel value from flat RGBA array. Returns [r, g, b, a]. */
export function getPixel(data: Uint8ClampedArray, x: number, y: number, width: number): [number, number, number, number] {
  const idx = (y * width + x) * 4;
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
}

/** Write a pixel into flat RGBA array. */
export function setPixel(data: Uint8ClampedArray, x: number, y: number, width: number, r: number, g: number, b: number, a = 255): void {
  const idx = (y * width + x) * 4;
  data[idx] = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
}

/** Clamp a value to [0, 255]. */
export function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** Convert RGB to perceived luminance (ITU-R BT.601). */
export function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** Load an image URL into ImageData via an offscreen canvas. */
export async function loadImageFromUrl(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Resize ImageData to fit within maxDim × maxDim, preserving aspect ratio. */
export function resizeImageData(src: ImageData, maxDim: number): ImageData {
  const { width, height } = src;
  if (width <= maxDim && height <= maxDim) return src;
  const scale = Math.min(maxDim / width, maxDim / height);
  const newW = Math.round(width * scale);
  const newH = Math.round(height * scale);
  const srcCanvas = imageDataToCanvas(src);
  const dstCanvas = document.createElement("canvas");
  dstCanvas.width = newW;
  dstCanvas.height = newH;
  const ctx = dstCanvas.getContext("2d")!;
  ctx.drawImage(srcCanvas, 0, 0, newW, newH);
  return ctx.getImageData(0, 0, newW, newH);
}

/** Convert ImageData to a data URL (PNG). */
export function imageDataToDataUrl(imageData: ImageData): string {
  const canvas = imageDataToCanvas(imageData);
  return canvas.toDataURL("image/png");
}
