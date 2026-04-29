/**
 * Generate sample PNG images
 */
import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "samples");
mkdirSync(outDir, { recursive: true });

// ─── Minimal PNG encoder ────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(data) {
  let c = 0xffffffff;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.allocUnsafe(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([len, typeBytes, data, crc]);
}

/** Write a PNG from a flat RGBA pixel array. */
function makePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;   // bit depth
  ihdrData[9] = 2;   // color type: RGB (no alpha in PNG to keep it simple)
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;

  // Build raw scanlines (filter byte 0x00 + RGB per pixel)
  const scanlines = Buffer.allocUnsafe(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    scanlines[rowStart] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = rowStart + 1 + x * 3;
      scanlines[dst]     = rgba[src];
      scanlines[dst + 1] = rgba[src + 1];
      scanlines[dst + 2] = rgba[src + 2];
    }
  }

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdrData),
    chunk("IDAT", deflateSync(scanlines)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Clamp to [0,255]. */
const c = (v) => Math.max(0, Math.min(255, Math.round(v)));

// ─── Image generators ───────────────────────────────────────────────────────

function makeCheckerboard(size = 256, tileSize = 32) {
  const px = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const even = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
      const v = even ? 45 : 240;
      const i = (y * size + x) * 4;
      px[i] = px[i + 1] = px[i + 2] = v;
      px[i + 3] = 255;
    }
  }
  return makePNG(size, size, px);
}

function makeGradient(w = 256, h = 256) {
  const px = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const tx = x / w, ty = y / h;
      // Purple-blue gradient
      const i = (y * w + x) * 4;
      px[i]   = c(98  + (236 - 98)  * tx + (168 - 98)  * ty);
      px[i+1] = c(113 + (72  - 113) * tx + (85  - 113) * ty);
      px[i+2] = c(245 + (153 - 245) * tx + (247 - 245) * ty);
      px[i+3] = 255;
    }
  }
  return makePNG(w, h, px);
}

function makeLandscape(w = 400, h = 300) {
  const px = new Uint8Array(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const fy = y / h, fx = x / w;

      if (fy < 0.6) {
        // Sky: gradient blue
        const t = fy / 0.6;
        px[i]   = c(135 + (191 - 135) * t);
        px[i+1] = c(206 + (219 - 206) * t);
        px[i+2] = c(235 + (254 - 235) * t);
      } else {
        // Ground: green
        px[i]   = c(50  + 30 * fy);
        px[i+1] = c(150 - 40 * fy);
        px[i+2] = c(40);
      }
      px[i+3] = 255;

      // Sun
      const sx = w * 0.78, sy = h * 0.18, sr = 28;
      if ((x - sx) ** 2 + (y - sy) ** 2 < sr ** 2) {
        px[i] = 253; px[i+1] = 224; px[i+2] = 71;
      }

      // Mountains (simple triangular ridgeline)
      const ridge = (fxv) => {
        const pts = [[0,0.6],[0.2,0.25],[0.45,0.55],[0.6,0.32],[0.8,0.48],[1,0.55]];
        for (let k = 0; k < pts.length - 1; k++) {
          const [x1, y1] = pts[k], [x2, y2] = pts[k + 1];
          if (fxv >= x1 && fxv <= x2) {
            return y1 + (y2 - y1) * ((fxv - x1) / (x2 - x1));
          }
        }
        return 0.6;
      };
      const mtnY = ridge(fx);
      if (fy >= mtnY && fy < 0.6) {
        const shade = 100 + 40 * fy;
        px[i] = c(shade); px[i+1] = c(shade + 15); px[i+2] = c(shade + 25);
      }
    }
  }
  return makePNG(w, h, px);
}

function makePortrait(w = 300, h = 380) {
  const px = new Uint8Array(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // Background
      px[i] = 241; px[i+1] = 245; px[i+2] = 249; px[i+3] = 255;

      const fx = x / w, fy = y / h;

      // Shirt
      if (fy > 0.58 && fx > 0.18 && fx < 0.82) {
        px[i] = 59; px[i+1] = 130; px[i+2] = 246;
      }

      // Neck
      if (fy > 0.5 && fy < 0.6 && fx > 0.42 && fx < 0.58) {
        px[i] = 252; px[i+1] = 211; px[i+2] = 77;
      }

      // Face (ellipse)
      const faceX = (x - w * 0.5) / (w * 0.22);
      const faceY = (y - h * 0.35) / (h * 0.19);
      if (faceX ** 2 + faceY ** 2 < 1) {
        px[i] = 252; px[i+1] = 211; px[i+2] = 77;
      }

      // Eyes
      for (const eyeFx of [0.37, 0.63]) {
        const eyeX = (x - w * eyeFx) / 9;
        const eyeY = (y - h * 0.31) / 7;
        if (eyeX ** 2 + eyeY ** 2 < 1) {
          px[i] = 30; px[i+1] = 41; px[i+2] = 59;
        }
      }

      // Smile (arc approximation)
      const smileX = x - w * 0.5;
      const smileR = w * 0.12;
      const smileCY = h * 0.395;
      if (Math.abs(Math.sqrt(smileX ** 2 + (y - smileCY - smileR * 0.3) ** 2) - smileR) < 2.5
          && smileX > -smileR * 0.7 && smileX < smileR * 0.7
          && y > smileCY) {
        px[i] = 30; px[i+1] = 41; px[i+2] = 59;
      }
    }
  }
  return makePNG(w, h, px);
}

// ─── Write files ─────────────────────────────────────────────────────────────

writeFileSync(join(outDir, "checkerboard.png"), makeCheckerboard());
console.log("✓ checkerboard.png");

writeFileSync(join(outDir, "gradient.png"), makeGradient());
console.log("✓ gradient.png");

writeFileSync(join(outDir, "landscape.jpg"), makeLandscape());
console.log("✓ landscape.jpg (PNG bytes with .jpg extension; browsers handle it fine)");

writeFileSync(join(outDir, "portrait.jpg"), makePortrait());
console.log("✓ portrait.jpg (PNG bytes with .jpg extension; browsers handle it fine)");

console.log(`\nSample images written to ${outDir}`);
