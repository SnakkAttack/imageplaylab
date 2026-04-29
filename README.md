# Image Play Lab

An interactive learning tool for digital image processing. Upload an image, apply course-related algorithms, adjust parameters in real time, compare before and after, and read clear explanations of what is happening.

Built as a final project for a digital image processing course.

---

## Team

| Name | Role |
| --- | --- |
| **Gage** | Backend (image processing algorithms, data layer, deployment) |
| **Sam** | Frontend (UI/UX design, component architecture, design system) |

---

## Features

- **Drag-and-drop image upload**: JPEG, PNG, WebP; automatic resize for performance
- **4 built-in sample images**: explore without uploading anything
- **8 processing modules** with multiple operations each
- **Side-by-side and comparison slider views**
- **Real-time parameter controls**: sliders update the output as you drag
- **Histogram view**: grayscale or RGB, updates with every operation
- **Image quality metrics**: MSE, PSNR, and SSIM
- **Download processed image** as PNG
- **Plain-English + mathematical explanations** for every module
- **Fully client-side**: no server, no sign-up, no data leaves the browser

---

## Modules

| Module | Operations |
| --- | --- |
| Image Basics | Original, Grayscale, Red/Green/Blue channel isolation |
| Noise | Gaussian noise, Salt & pepper, Uniform noise |
| Filtering | Mean blur, Gaussian blur, Median filter |
| Edge Detection | Sobel, Laplacian, Canny (full pipeline) |
| Thresholding | Manual threshold, Otsu automatic, Inverse |
| Histogram | Histogram view, Histogram equalization |
| Morphology | Erosion, Dilation, Opening, Closing |
| Metrics | MSE, PSNR, SSIM between original and processed |

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 (App Router + Turbopack) | Framework |
| TypeScript | Type safety throughout |
| Tailwind CSS | Styling |
| Canvas API | Client-side image processing |
| Vercel | Deployment |

All image processing algorithms are implemented from scratch in TypeScript with no external image-processing libraries, so the code itself is educational.

---

## Getting Started

```bash
# Install dependencies
npm install

# Generate built-in sample images (run once)
node scripts/generate-samples.mjs

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```text
app/
  page.tsx              Home / landing page
  lab/page.tsx          Interactive lab
  about/page.tsx        About the project
components/
  layout/               Header, Footer
  lab/                  LabShell, ImageUploader, ImageWorkspace,
                        ModuleTabs, ControlPanel, ExplanationCard,
                        HistogramView, MetricCard
  ui/                   Button, Card, SliderControl, SegmentedControl
lib/
  image-processing/     canvas-utils, basics, noise, filtering,
                        edge-detection, thresholding, histogram,
                        morphology, metrics, processor (operation router)
data/
  modules.ts            Module definitions and educational copy
types/
  image.ts              TypeScript interfaces (ImageState, ModuleDef, etc.)
scripts/
  generate-samples.mjs  Generates sample images using Node built-ins
```

---

## Deploying to Vercel

```bash
# Push to GitHub then connect the repo in the Vercel dashboard
# No environment variables needed; fully static/client-side
```

---

## Academic Purpose

This project demonstrates the following concepts from a standard image processing curriculum:

- **Pixel model**: RGB color space, grayscale luminance weighting
- **Noise models**: Gaussian, impulsive (salt-and-pepper), uniform additive noise
- **Linear filtering**: convolution, box kernel, Gaussian kernel
- **Nonlinear filtering**: median filter for impulsive noise
- **Edge detection**: first/second-order derivatives, Sobel, Laplacian, full Canny pipeline with non-maximum suppression and hysteresis thresholding
- **Segmentation**: binary thresholding, Otsu's optimal threshold via inter-class variance maximization
- **Histogram analysis**: brightness distributions, CDF-based equalization
- **Morphological operations**: erosion/dilation on binary images, structuring elements, opening/closing
- **Quality metrics**: MSE, PSNR in dB, structural similarity index (SSIM)

---

## Future Improvements

- Save/restore experiment configurations
- Student worksheets for guided exploration
- Knowledge-check quizzes per module
- Teacher mode with annotation and presentation tools
- Webcam live feed processing
- FFT and frequency-domain operations
- Feature detection (Harris corners, SIFT descriptors)
- Image segmentation (k-means, watershed)
