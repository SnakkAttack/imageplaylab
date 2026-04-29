// Noise injection: Gaussian, salt-and-pepper, and uniform.
// Used to simulate real sensor noise so you can then test how well filters remove it.
// Gage

import { cloneImageData, clamp255 } from "./canvas-utils";

// Box-Muller transform: turns two uniform random numbers into one normal-distributed one.
// Needed because Math.random() only gives uniform [0,1], not Gaussian.
function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // avoid log(0)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function applyGaussianNoise(src: ImageData, sigma: number): ImageData {
  const dst = cloneImageData(src);
  const data = dst.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = clamp255(data[i]     + gaussianRandom() * sigma);
    data[i + 1] = clamp255(data[i + 1] + gaussianRandom() * sigma);
    data[i + 2] = clamp255(data[i + 2] + gaussianRandom() * sigma);
    // alpha stays untouched
  }
  return dst;
}

export function applySaltAndPepperNoise(src: ImageData, probability: number): ImageData {
  const dst = cloneImageData(src);
  const data = dst.data;
  const halfP = probability / 2; // split evenly between salt and pepper
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.random();
    if (r < halfP) {
      // pepper: set to black
      data[i] = data[i + 1] = data[i + 2] = 0;
    } else if (r < probability) {
      // salt: set to white
      data[i] = data[i + 1] = data[i + 2] = 255;
    }
  }
  return dst;
}

export function applyUniformNoise(src: ImageData, intensity: number): ImageData {
  const dst = cloneImageData(src);
  const data = dst.data;
  for (let i = 0; i < data.length; i += 4) {
    // Same offset for all three channels so it shifts brightness, not hue
    const offset = (Math.random() * 2 - 1) * intensity;
    data[i]     = clamp255(data[i]     + offset);
    data[i + 1] = clamp255(data[i + 1] + offset);
    data[i + 2] = clamp255(data[i + 2] + offset);
  }
  return dst;
}
