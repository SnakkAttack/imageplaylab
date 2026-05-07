// Shared helpers for working with ImageData across all processing modules.

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
  return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
}

// blank ImageData with same width/height as src, all zeros
export function blankLike(src: ImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(src.width * src.height * 4), src.width, src.height);
}

// returns [r, g, b, a] for pixel at (x, y)
export function getPixel(data: Uint8ClampedArray, x: number, y: number, width: number): [number, number, number, number] {
  const idx = (y * width + x) * 4;
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
}

// write r,g,b,a into pixel at (x, y)
export function setPixel(data: Uint8ClampedArray, x: number, y: number, width: number, r: number, g: number, b: number, a = 255): void {
  const idx = (y * width + x) * 4;
  data[idx] = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
}

// clamp to [0, 255]
export function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

// perceived brightness using ITU-R BT.601 weights (green weighted most, blue least)
export function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

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

// downscale to fit within maxDim x maxDim, keeping aspect ratio
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

// render ImageData to a canvas and export as PNG data URL
export function imageDataToDataUrl(imageData: ImageData): string {
  const canvas = imageDataToCanvas(imageData);
  return canvas.toDataURL("image/png");
}
