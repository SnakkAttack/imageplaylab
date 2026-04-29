import type { ModuleDef } from "@/types/image";

export const MODULE_DEFS: ModuleDef[] = [
  {
    id: "basics",
    label: "Image Basics",
    icon: "🖼️",
    shortDescription: "Pixels, channels, and grayscale conversion",
    operations: [
      {
        id: "original",
        label: "Original",
        params: [],
      },
      {
        id: "grayscale",
        label: "Grayscale",
        params: [],
      },
      {
        id: "channel_red",
        label: "Red Channel",
        params: [],
      },
      {
        id: "channel_green",
        label: "Green Channel",
        params: [],
      },
      {
        id: "channel_blue",
        label: "Blue Channel",
        params: [],
      },
    ],
    explanation: {
      title: "Image Basics",
      plainEnglish:
        "Every digital image is a grid of pixels. Each pixel stores color as three numbers: Red, Green, and Blue (0–255). Grayscale images convert that color information into a single brightness value per pixel.",
      technical:
        "Grayscale conversion uses a luminance-weighted formula: L = 0.299·R + 0.587·G + 0.114·B. The weights reflect human visual sensitivity; we perceive green most strongly, red moderately, and blue the least.",
      parameters:
        "No parameters for this module. Select a channel or grayscale to isolate that component.",
      lookFor:
        "Notice how red objects become bright in the red channel, dark in blue. Grayscale preserves perceived brightness rather than simply averaging the channels.",
      useCases:
        "Grayscale simplifies many algorithms. Channel separation is used in color grading, chroma keying, and diagnostic imaging.",
    },
  },
  {
    id: "noise",
    label: "Noise",
    icon: "📡",
    shortDescription: "Add Gaussian, salt-and-pepper, or uniform noise",
    operations: [
      {
        id: "gaussian_noise",
        label: "Gaussian Noise",
        params: [
          {
            key: "sigma",
            label: "Standard Deviation (σ)",
            min: 1,
            max: 80,
            step: 1,
            defaultValue: 25,
            description:
              "Controls noise intensity. Higher σ = more corruption.",
          },
        ],
      },
      {
        id: "salt_pepper",
        label: "Salt & Pepper",
        params: [
          {
            key: "probability",
            label: "Probability",
            min: 0.01,
            max: 0.3,
            step: 0.01,
            defaultValue: 0.05,
            description:
              "Fraction of pixels replaced with black or white. 0.05 = 5% of pixels.",
          },
        ],
      },
      {
        id: "uniform_noise",
        label: "Uniform Noise",
        params: [
          {
            key: "intensity",
            label: "Intensity",
            min: 5,
            max: 100,
            step: 1,
            defaultValue: 30,
            description:
              "Maximum random offset added or subtracted from each channel.",
          },
        ],
      },
    ],
    explanation: {
      title: "Image Noise",
      plainEnglish:
        "Noise is unwanted random variation in pixel values. It occurs in real cameras due to sensor limitations, low light, heat, or transmission errors. Understanding noise is the first step toward removing it.",
      technical:
        "Gaussian noise adds values drawn from a normal distribution N(0, σ²) to each pixel. Salt-and-pepper sets random pixels to 0 (pepper) or 255 (salt) with probability p. Uniform noise adds values drawn uniformly from [-intensity, +intensity].",
      parameters:
        "Sigma (σ) controls Gaussian spread. Probability controls how many pixels are corrupted in salt-and-pepper. Intensity controls the maximum deviation in uniform noise.",
      lookFor:
        "Gaussian noise looks like film grain (smooth but random). Salt-and-pepper creates isolated bright and dark specks. Uniform noise appears as a fine overall haze.",
      useCases:
        "Used to simulate real-world sensor noise in algorithm testing. Understanding noise types helps choose the right denoising filter.",
    },
  },
  {
    id: "filtering",
    label: "Filtering",
    icon: "🔍",
    shortDescription: "Mean, Gaussian, and median blur",
    operations: [
      {
        id: "mean_blur",
        label: "Mean Blur",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 21,
            step: 2,
            defaultValue: 5,
            description:
              "Size of the averaging window. Must be odd. Larger = more blurring.",
          },
        ],
      },
      {
        id: "gaussian_blur",
        label: "Gaussian Blur",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 21,
            step: 2,
            defaultValue: 5,
            description: "Neighborhood size. Larger values blur more.",
          },
          {
            key: "sigma",
            label: "Sigma (σ)",
            min: 0.5,
            max: 10,
            step: 0.5,
            defaultValue: 1.5,
            description:
              "Spread of the Gaussian bell curve. Higher = smoother falloff.",
          },
        ],
      },
      {
        id: "median_filter",
        label: "Median Filter",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 15,
            step: 2,
            defaultValue: 5,
            description:
              "Size of the sorting window. Larger removes more extreme outliers.",
          },
        ],
      },
    ],
    explanation: {
      title: "Spatial Filtering",
      plainEnglish:
        "Filters smooth images by replacing each pixel with a summary of its neighborhood. Mean blur averages neighbors. Gaussian blur weights closer neighbors more. Median uses the middle value, making it especially robust against spikes.",
      technical:
        "Mean and Gaussian blur apply linear convolution: output[x,y] = Σ kernel[i,j] · input[x+i, y+j]. Median is non-linear: output[x,y] = median of all pixels in the window. Non-linear filters preserve edges better when removing impulsive noise.",
      parameters:
        "Kernel size controls the neighborhood extent. Sigma controls how quickly Gaussian weights fall off. Odd kernel sizes are required to have a center pixel.",
      lookFor:
        "All three blur edges and reduce high-frequency content. Median preserves sharp edges far better than mean or Gaussian when noise is salt-and-pepper.",
      useCases:
        "Pre-processing before edge detection. Noise removal after image acquisition. Gaussian blur is used in Canny edge detection as a preprocessing step.",
    },
  },
  {
    id: "edges",
    label: "Edge Detection",
    icon: "🔲",
    shortDescription: "Sobel, Laplacian, and Canny operators",
    operations: [
      {
        id: "sobel",
        label: "Sobel",
        params: [
          {
            key: "scale",
            label: "Scale",
            min: 1,
            max: 8,
            step: 1,
            defaultValue: 4,
            description:
              "Multiplier to brighten the gradient magnitude for visualization.",
          },
        ],
      },
      {
        id: "laplacian",
        label: "Laplacian",
        params: [
          {
            key: "scale",
            label: "Scale",
            min: 1,
            max: 8,
            step: 1,
            defaultValue: 4,
            description: "Multiplier to amplify the Laplacian response.",
          },
        ],
      },
      {
        id: "canny",
        label: "Canny",
        params: [
          {
            key: "lowThreshold",
            label: "Low Threshold",
            min: 5,
            max: 100,
            step: 5,
            defaultValue: 30,
            description:
              "Weak edges below this value are discarded. Keep low to detect fine edges.",
          },
          {
            key: "highThreshold",
            label: "High Threshold",
            min: 20,
            max: 200,
            step: 5,
            defaultValue: 90,
            description:
              "Strong edges above this are always kept. Should be ~2–3× the low threshold.",
          },
        ],
      },
    ],
    explanation: {
      title: "Edge Detection",
      plainEnglish:
        "Edges are places where pixel brightness changes rapidly. Detecting them reveals object boundaries, shapes, and textures. Different operators look for edges in different ways.",
      technical:
        "Sobel computes first-order gradient magnitude: |Gx| + |Gy|, where Gx and Gy are the horizontal/vertical convolutions. Laplacian computes second-order derivatives to find zero-crossings. Canny uses Gaussian pre-smoothing, Sobel gradients, non-maximum suppression, and hysteresis thresholding.",
      parameters:
        "Scale amplifies output for display. Canny thresholds control which gradient magnitudes count as edges: high for definite edges, low for weak edge candidates.",
      lookFor:
        "Sobel shows gradient direction and magnitude. Laplacian highlights zero-crossings at edges. Canny produces thin, clean edge maps with fewer false positives than Sobel alone.",
      useCases:
        "Object detection, segmentation, lane detection in autonomous vehicles, medical image analysis, and feature extraction.",
    },
  },
  {
    id: "threshold",
    label: "Thresholding",
    icon: "⚖️",
    shortDescription: "Binary and Otsu thresholding",
    operations: [
      {
        id: "manual_threshold",
        label: "Manual Threshold",
        params: [
          {
            key: "threshold",
            label: "Threshold Value",
            min: 0,
            max: 255,
            step: 1,
            defaultValue: 128,
            description:
              "Pixels above this value become white (255); below become black (0).",
          },
        ],
      },
      {
        id: "otsu",
        label: "Otsu Threshold",
        params: [],
      },
      {
        id: "inverse_threshold",
        label: "Inverse Threshold",
        params: [
          {
            key: "threshold",
            label: "Threshold Value",
            min: 0,
            max: 255,
            step: 1,
            defaultValue: 128,
            description:
              "Inverted: pixels above become black (0), below become white (255).",
          },
        ],
      },
    ],
    explanation: {
      title: "Thresholding",
      plainEnglish:
        "Thresholding converts a grayscale image into a binary (black-and-white) image. Every pixel is judged: bright enough → white, too dark → black. This separates objects from background.",
      technical:
        "Binary threshold: output[x,y] = 255 if input[x,y] > T else 0. Otsu's method automatically finds T by maximizing inter-class variance between the foreground and background pixel distributions, so no manual tuning is needed.",
      parameters:
        "Threshold T divides the grayscale range [0,255]. Otsu computes T automatically from the image histogram, so no slider is needed.",
      lookFor:
        "Manual threshold misses detail if chosen poorly. Otsu typically finds a natural separation point. Watch how thin structures disappear at low thresholds.",
      useCases:
        "Document scanning, medical imaging, barcode reading, and any task requiring clean binary masks.",
    },
  },
  {
    id: "histogram",
    label: "Histogram",
    icon: "📊",
    shortDescription: "Brightness distribution and equalization",
    operations: [
      {
        id: "histogram_view",
        label: "View Histogram",
        params: [],
      },
      {
        id: "histogram_equalization",
        label: "Histogram Equalization",
        params: [],
      },
    ],
    explanation: {
      title: "Histograms",
      plainEnglish:
        "A histogram shows how often each brightness value (0–255) appears in the image. A low-contrast image has a narrow histogram; a high-contrast image spreads across the full range. Equalization stretches the histogram to improve contrast.",
      technical:
        "Histogram equalization computes the cumulative distribution function (CDF) of pixel intensities and uses it as a mapping function: output[x,y] = round((CDF[input[x,y]] - CDF_min) / (N - CDF_min) × 255), where N is the total number of pixels.",
      parameters:
        "No parameters. Equalization is fully automatic and derived from the image's own intensity distribution.",
      lookFor:
        "After equalization, low-contrast images often reveal hidden texture and detail. Over-equalized images may look unnaturally harsh.",
      useCases:
        "Medical imaging (X-rays), satellite imagery, night vision, and any domain where contrast enhancement is critical.",
    },
  },
  {
    id: "morphology",
    label: "Morphology",
    icon: "🔬",
    shortDescription: "Erosion, dilation, opening, and closing",
    operations: [
      {
        id: "erosion",
        label: "Erosion",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 15,
            step: 2,
            defaultValue: 3,
            description:
              "Size of the structuring element. Larger kernels erode more aggressively.",
          },
        ],
      },
      {
        id: "dilation",
        label: "Dilation",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 15,
            step: 2,
            defaultValue: 3,
            description: "Size of the structuring element. Larger = more expansion.",
          },
        ],
      },
      {
        id: "opening",
        label: "Opening (Erosion → Dilation)",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 15,
            step: 2,
            defaultValue: 5,
            description:
              "Controls how much small foreground blobs are removed before restoration.",
          },
        ],
      },
      {
        id: "closing",
        label: "Closing (Dilation → Erosion)",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 15,
            step: 2,
            defaultValue: 5,
            description:
              "Controls how large the gaps filled in the foreground can be.",
          },
        ],
      },
    ],
    explanation: {
      title: "Morphological Operations",
      plainEnglish:
        "Morphological operations reshape binary or grayscale image regions using a small template called a structuring element. Erosion shrinks bright regions; dilation expands them. Combining them removes noise while preserving structure.",
      technical:
        "Erosion: output[x,y] = min of input pixels covered by kernel. Dilation: output[x,y] = max of covered pixels. Opening = erosion then dilation (removes small bright blobs). Closing = dilation then erosion (fills small dark holes).",
      parameters:
        "Kernel size controls the structuring element. These operations work best on a thresholded (binary) image, so apply thresholding first for clearest results.",
      lookFor:
        "Erosion shrinks foreground objects and removes thin connections. Dilation fills holes and connects nearby objects. Opening removes noise; closing fills gaps.",
      useCases:
        "Binary image cleanup, cell counting, object shape analysis, fingerprint processing.",
    },
  },
  {
    id: "metrics",
    label: "Metrics",
    icon: "📐",
    shortDescription: "MSE, PSNR, and SSIM between images",
    operations: [
      {
        id: "metrics_view",
        label: "Compute Metrics",
        params: [],
      },
    ],
    explanation: {
      title: "Image Quality Metrics",
      plainEnglish:
        "When we modify an image, how much damage did we do? Metrics like MSE and PSNR give a numerical answer. Lower MSE means less distortion. Higher PSNR means better quality. SSIM measures structural similarity rather than just pixel differences.",
      technical:
        "MSE = (1/N) Σ (original[i] - processed[i])². PSNR = 10 · log₁₀(255² / MSE), measured in dB. SSIM combines luminance, contrast, and structure comparisons using local statistics in overlapping windows.",
      parameters:
        "No parameters. Metrics are computed automatically from the original and processed images.",
      lookFor:
        "A PSNR above ~30 dB is generally considered good quality. SSIM ranges from 0 to 1; values above 0.95 indicate very high structural similarity.",
      useCases:
        "Evaluating compression algorithms, noise reduction methods, and any image processing pipeline where quality preservation matters.",
    },
  },
];

export const MODULE_ORDER: ModuleDef["id"][] = [
  "basics",
  "noise",
  "filtering",
  "edges",
  "threshold",
  "histogram",
  "morphology",
  "metrics",
];
