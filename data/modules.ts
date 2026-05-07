import type { ModuleDef } from "@/types/image";

export const MODULE_DEFS: ModuleDef[] = [
  {
    id: "basics",
    label: "Image Basics",
    icon: "🖼️",
    shortDescription: "Pixels, channels, and basic adjustments",
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
      {
        id: "brightness",
        label: "Brightness",
        params: [
          {
            key: "amount",
            label: "Amount",
            min: -128,
            max: 128,
            step: 1,
            defaultValue: 30,
            description: "Positive values brighten, negative values darken.",
          },
        ],
      },
      {
        id: "contrast",
        label: "Contrast",
        params: [
          {
            key: "factor",
            label: "Factor",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.5,
            description: "1.0 = no change. Above 1.0 increases contrast, below decreases it.",
          },
        ],
      },
      {
        id: "gamma",
        label: "Gamma Correction",
        params: [
          {
            key: "gamma",
            label: "Gamma (γ)",
            min: 0.1,
            max: 4.0,
            step: 0.1,
            defaultValue: 1.0,
            description: "Values below 1.0 brighten midtones. Above 1.0 darkens them.",
          },
        ],
      },
      {
        id: "invert",
        label: "Invert",
        params: [],
      },
      {
        id: "sepia",
        label: "Sepia",
        params: [],
      },
    ],
    explanation: {
      title: "Image Basics",
      plainEnglish:
        "A digital image is just a grid of pixels. Each pixel stores three numbers: Red, Green, and Blue, each ranging from 0 to 255. Black is (0,0,0), white is (255,255,255). Grayscale collapses those three numbers into one brightness value. Separating channels lets you see exactly how much each color contributes to the image.",
      technical:
        "Grayscale uses a luminance-weighted average: L = 0.299·R + 0.587·G + 0.114·B. The weights match human eye sensitivity (green receptors are most abundant). Brightness adds a constant: out = clamp(in + k). Contrast scales around 128: out = clamp(factor · (in - 128) + 128). Gamma applies a power curve: out = (in/255)^(1/γ) · 255, correcting for display nonlinearity.",
      parameters:
        "Brightness: positive values shift all channels up (brighter), negative shift down. Contrast factor above 1.0 pushes pixels away from mid-gray, below 1.0 pulls them toward it. Gamma below 1.0 lifts shadows and midtones, above 1.0 darkens them. Factor of 1.0 and gamma of 1.0 both leave the image unchanged.",
      lookFor:
        "In the red channel, red objects go bright and blue objects go very dark. In the blue channel it flips. Grayscale removes all hue info but keeps perceived brightness. High contrast will clip highlights and crush shadows. Gamma below 1.0 reveals detail in dark areas that looked black. Sepia gives a warm brownish tone by mixing all three channels together with fixed weights.",
      useCases:
        "Grayscale is used as input for most algorithms (edge detection, thresholding, morphology). Channel separation is used in color grading, chroma keying, and skin detection. Gamma correction is essential in photo pipelines because camera sensors record light linearly but displays are nonlinear.",
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
        "Noise is random unwanted variation added to pixel values. In real cameras it comes from sensor heat, low light, long exposure, or transmission errors. We add noise here on purpose so you can test how well different filters remove it. Different noise types look very different and respond best to different filters.",
      technical:
        "Gaussian noise adds a value drawn from N(0, σ²) independently to each channel. Salt-and-pepper randomly sets pixels to 0 (pepper) or 255 (salt) with total probability p, split evenly between the two. Uniform noise adds a single offset drawn from [-intensity, +intensity] to all three channels simultaneously, so it shifts brightness not hue.",
      parameters:
        "Gaussian sigma controls the standard deviation of the noise distribution. Higher sigma = more severe corruption. Salt-and-pepper probability is the fraction of pixels corrupted (0.05 = 5%). Uniform intensity is the max offset applied. Same offset across all channels keeps the color from shifting.",
      lookFor:
        "Gaussian noise looks like analog film grain: soft, everywhere, smoothly random. Salt-and-pepper creates harsh isolated white and black specks. Uniform noise is a flat subtle haze with no clustering. After adding noise, switch to the Filtering module and compare how mean, Gaussian, and median filters perform on each type.",
      useCases:
        "Gaussian noise simulates electronic sensor noise and low-light cameras. Salt-and-pepper simulates transmission bit errors and dead pixels. Uniform noise is used as a generic perturbation in algorithm robustness testing. The key insight: median filter kills salt-and-pepper cleanly but Gaussian blur barely helps it. Gaussian blur works well on Gaussian noise but median does less.",
    },
  },
  {
    id: "filtering",
    label: "Filtering",
    icon: "🔍",
    shortDescription: "Blur, sharpen, bilateral, and emboss",
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
      {
        id: "bilateral_filter",
        label: "Bilateral Filter",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 11,
            step: 2,
            defaultValue: 7,
            description: "Neighborhood size. Larger kernels are slower.",
          },
          {
            key: "sigmaSpace",
            label: "Sigma Space",
            min: 1,
            max: 20,
            step: 1,
            defaultValue: 5,
            description: "Controls how far spatially the filter reaches.",
          },
          {
            key: "sigmaColor",
            label: "Sigma Color",
            min: 5,
            max: 150,
            step: 5,
            defaultValue: 50,
            description: "Controls how different in color a pixel can be and still be included. Low values preserve edges better.",
          },
        ],
      },
      {
        id: "sharpen",
        label: "Sharpen",
        params: [
          {
            key: "amount",
            label: "Amount",
            min: 0.5,
            max: 5.0,
            step: 0.5,
            defaultValue: 1.5,
            description: "Strength of the sharpening. High values will over-sharpen and create halos.",
          },
        ],
      },
      {
        id: "emboss",
        label: "Emboss",
        params: [
          {
            key: "scale",
            label: "Scale",
            min: 0.5,
            max: 3.0,
            step: 0.5,
            defaultValue: 1.0,
            description: "Amplifies the relief effect. Flat areas stay mid-gray.",
          },
        ],
      },
    ],
    explanation: {
      title: "Spatial Filtering",
      plainEnglish:
        "Filters replace each pixel with some summary of its neighborhood. Mean and Gaussian blur average neighbors (Gaussian just weights closer ones more). Median takes the middle value instead of averaging, which is why it handles salt-and-pepper noise so much better. Bilateral filter adds a color similarity check so it blurs inside smooth regions but stops at edges. Sharpen is the reverse of blur: it adds back the high-frequency detail that blurring removes.",
      technical:
        "Mean and Gaussian are linear convolution: out[x,y] = sum(kernel[i,j] * in[x+i, y+j]). Median is non-linear: out[x,y] = median of all pixels in the window. Bilateral weights each neighbor by both spatial distance and color difference: w = exp(-dist²/2σs²) * exp(-colorDiff²/2σc²). Unsharp mask: out = clamp(in + amount * (in - gaussianBlur(in))). Emboss uses a diagonal asymmetric kernel and biases to 128 so flat areas render as mid-gray.",
      parameters:
        "Kernel size sets the neighborhood radius. Larger = more blur (and slower). Gaussian sigma controls how fast weights fall off with distance. Bilateral sigma space controls spatial reach, sigma color controls how strict the color similarity check is. Low sigma color = edges stay very sharp. High sigma color = acts more like regular Gaussian. Sharpen amount above 2.0 starts creating obvious halos.",
      lookFor:
        "Mean blur creates blocky blurring at large kernel sizes. Gaussian is smoother. Try median on an image with salt-and-pepper noise and compare it to Gaussian: median removes the specks while keeping edges sharp. Bilateral is best seen on a portrait: smooth skin, sharp facial features. Sharpen high-frequency textures like hair or fabric first. Emboss works best on images with clear diagonal structures.",
      useCases:
        "Gaussian blur is almost always used as a preprocessing step before edge detection because it reduces false edges from noise. Median is the standard fix for salt-and-pepper and dead pixels. Bilateral is used in portrait photography, medical imaging, and anywhere edges matter. Sharpening is used before print or display. Always match the filter to the noise type.",
    },
  },
  {
    id: "edges",
    label: "Edge Detection",
    icon: "🔲",
    shortDescription: "Sobel, Prewitt, Scharr, Laplacian, and Canny",
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
        id: "prewitt",
        label: "Prewitt",
        params: [
          {
            key: "scale",
            label: "Scale",
            min: 1,
            max: 8,
            step: 1,
            defaultValue: 4,
            description: "Multiplier to brighten the gradient magnitude.",
          },
        ],
      },
      {
        id: "scharr",
        label: "Scharr",
        params: [
          {
            key: "scale",
            label: "Scale",
            min: 1,
            max: 8,
            step: 1,
            defaultValue: 4,
            description: "Multiplier to brighten the gradient magnitude.",
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
              "Strong edges above this are always kept. Should be ~2-3x the low threshold.",
          },
        ],
      },
    ],
    explanation: {
      title: "Edge Detection",
      plainEnglish:
        "An edge is a place in an image where brightness changes sharply. Finding edges reveals object boundaries, shapes, and structure. Sobel, Prewitt, and Scharr measure the first derivative (rate of change). Laplacian measures the second derivative (where change changes). Canny combines multiple steps into a pipeline that produces the cleanest edges: smooth first to kill noise, find gradients, thin the edges to one pixel wide, then use two thresholds to keep only real edges.",
      technical:
        "Sobel: Gx and Gy via 3x3 kernels with 2x center row/column weighting, magnitude = sqrt(Gx²+Gy²). Prewitt: same structure without center weighting. Scharr: uses weights of 3/10/3 for better rotational symmetry. Laplacian: second derivative via 4-connected kernel [0,1,0 / 1,-4,1 / 0,1,0]. Canny pipeline: (1) Gaussian smooth, (2) Sobel gradients, (3) non-maximum suppression along gradient direction, (4) hysteresis thresholding with high/low values.",
      parameters:
        "Scale just amplifies gradient values for display purposes. Canny low threshold: gradient magnitudes above this are weak edge candidates. High threshold: above this are definite edges. Weak edges only survive if they connect to a strong edge (8-neighbor check). A 1:2 or 1:3 ratio between low and high threshold is a common starting point.",
      lookFor:
        "Sobel and Prewitt produce thick gradient maps with a gray value proportional to edge strength. Scharr looks nearly identical but diagonal edges are more accurate. Laplacian responds to noise heavily and can create double-edge artifacts. Canny gives thin single-pixel-wide edges. If low threshold is too small you get noisy edges everywhere. If high threshold is too large you get broken or missing edges. Try Canny on a face and watch how it picks out just the important structure.",
      useCases:
        "Canny is the go-to for most real applications (object detection, segmentation, lane detection). Sobel/Prewitt/Scharr are useful when you want a gradient magnitude map rather than binary edges. Laplacian is used in image sharpening and fine detail enhancement. All gradient-based operators should be preceded by Gaussian blur when the image has significant noise.",
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
        "Thresholding converts a grayscale image to pure black and white. Every pixel is compared to a cutoff value T: above T becomes white (foreground), below T becomes black (background). This is one of the simplest and most widely used segmentation techniques. Otsu's method removes the guesswork by automatically finding the best T from the image's own histogram.",
      technical:
        "Binary: out[x,y] = 255 if in[x,y] > T, else 0. Inverse flips the result. Otsu maximizes inter-class variance: σ_B² = w_b · w_f · (μ_b - μ_f)², where w are class probabilities and μ are class means. It sweeps every possible T from 0 to 254 and picks the one where the two classes (foreground and background) are most separated. This works best when the histogram has two distinct peaks (bimodal).",
      parameters:
        "Threshold T: lower values make more pixels white (lower bar for foreground). T of 128 is the midpoint. Inverse threshold flips which side is white. Otsu has no parameter because it computes T from the image. If Otsu gives a bad result, check the histogram: a single-peaked histogram means there is no clean separation.",
      lookFor:
        "Set T too low and almost everything becomes white. Set it too high and you lose too much foreground. Otsu finds the natural valley between histogram peaks automatically. Thin structures and fine detail tend to disappear first at high thresholds. Try thresholding a scanned document vs a photo and notice how much easier documents are. Run Otsu on a simple object photo then on a complex natural scene and see where it succeeds or fails.",
      useCases:
        "Document scanning (text is dark, paper is light, clean separation). Counting objects in microscopy images. Creating binary masks for morphological operations. Barcode reading. Medical imaging where tissue types have different intensities. Global thresholding like this fails on images with uneven lighting since a single T cannot handle locally varying brightness.",
    },
  },
  {
    id: "histogram",
    label: "Histogram",
    icon: "📊",
    shortDescription: "View, equalize, or stretch brightness distribution",
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
      {
        id: "histogram_stretch",
        label: "Histogram Stretch",
        params: [],
      },
    ],
    explanation: {
      title: "Histograms",
      plainEnglish:
        "A histogram plots how many pixels exist at each brightness level from 0 (black) to 255 (white). A narrow histogram means most pixels are similar in brightness (low contrast). A wide spread means good contrast. Stretch is the simple fix: just map the actual min and max to 0 and 255. Equalization is smarter: it redistributes pixel values using the cumulative distribution so every brightness range is used roughly equally.",
      technical:
        "Histogram stretch: out = round((in - min) / (max - min) * 255). It is a linear mapping and just slides and scales the existing distribution. Equalization uses the CDF: out = round((CDF(in) - CDF_min) / (N - CDF_min) * 255), where N is total pixels. The CDF maps frequently occurring intensity values to a wider output range. The result is a roughly flat histogram.",
      parameters:
        "No parameters for either operation. Both are automatic. Stretch depends only on the min and max pixel value in the image. Equalization depends on the full distribution. An image that is already full-range (min=0, max=255) will be unchanged by stretch but may still be changed by equalization if the distribution is uneven.",
      lookFor:
        "On a foggy or underexposed image, stretch reveals contrast that was hidden in a narrow intensity range. Equalization is more aggressive and can cause over-enhancement: noise becomes more visible and textures can look harsh. Compare stretch vs equalization on the same image. On an already well-exposed image stretch does almost nothing but equalization still modifies it. Both operations convert the image to grayscale since they work on luminance.",
      useCases:
        "X-ray imaging where soft tissue differences are subtle. Satellite imagery with limited dynamic range. Night vision enhancement. Shadow detail recovery. Equalization is used heavily in medical imaging. Stretch is a quick normalization step before comparing images from different sensors.",
    },
  },
  {
    id: "morphology",
    label: "Morphology",
    icon: "🔬",
    shortDescription: "Erosion, dilation, opening, closing, and gradient",
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
        label: "Opening (Erosion then Dilation)",
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
        label: "Closing (Dilation then Erosion)",
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
      {
        id: "morph_gradient",
        label: "Morphological Gradient",
        params: [
          {
            key: "kernelSize",
            label: "Kernel Size",
            min: 3,
            max: 15,
            step: 2,
            defaultValue: 3,
            description: "Larger kernels produce thicker edge outlines.",
          },
        ],
      },
    ],
    explanation: {
      title: "Morphological Operations",
      plainEnglish:
        "Morphological operations reshape the regions in a binary (black/white) image using a small template called a structuring element. The structuring element slides over the image and at each position asks: is every neighbor white (erosion) or is any neighbor white (dilation)? Erosion shrinks objects. Dilation grows them. Combining them lets you remove noise without losing structure (opening) or fill gaps without growing objects too much (closing).",
      technical:
        "Erosion: out[x,y] = 255 only if all pixels under the kernel are 255, else 0. Dilation: out[x,y] = 255 if any pixel under the kernel is 255. Opening = erosion then dilation with same kernel. Closing = dilation then erosion. Morphological gradient = dilation - erosion (pixel-wise subtraction of binary arrays, gives 255 at boundaries). All operations first convert to binary grayscale via luminance threshold at 127.",
      parameters:
        "Kernel size is the size of the structuring element (square). Larger kernels erode/dilate more aggressively. These operations are designed for binary images, so threshold first for clearest results. Running them on grayscale photos will work but results can be hard to interpret.",
      lookFor:
        "Erosion removes thin connections and small bright specks. Dilation fills small holes and connects nearby blobs. Opening (erode then dilate) removes small noise blobs without shrinking larger objects much. Closing (dilate then erode) fills small dark holes without growing objects much. Gradient gives a thin outline of every region boundary. Try thresholding first then applying these, the binary input makes the effects much clearer.",
      useCases:
        "Cleaning up binary masks after thresholding. Separating touching objects in microscopy (erosion). Connecting broken lines or filling small gaps (dilation/closing). Extracting object boundaries (morphological gradient). Counting cells or particles where objects need to be separated first. Fingerprint ridge thinning. Document text cleanup.",
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
        "When you apply an operation to an image, how much did it change it? MSE and PSNR count pixel-level differences. They are simple and fast but they do not always match what humans actually see as quality. SSIM is designed to better match human perception by comparing structure, contrast, and brightness rather than raw pixel values. Two images can have identical MSE but look very different to a person, and SSIM often catches this.",
      technical:
        "MSE = (1/N) sum((original - processed)²) averaged over all pixels and RGB channels. PSNR = 10 * log10(255² / MSE) in decibels. Higher dB = less distortion. SSIM = ((2*μa*μb + C1)(2*σab + C2)) / ((μa² + μb² + C1)(σa² + σb² + C2)), where μ are means, σ are variances, and C1/C2 are stability constants (from Wang et al. 2004). Our implementation uses global image statistics rather than local 8x8 windows for performance.",
      parameters:
        "No parameters. All three metrics are computed automatically by comparing the current processed output to the original image. Apply any operation in another module first, then switch to Metrics to measure the distortion that operation caused.",
      lookFor:
        "Gaussian blur can have a reasonably high PSNR (low MSE) but SSIM drops more because blurring destroys structural information. A slight brightness shift has low SSIM impact but can inflate MSE. Heavy noise has terrible PSNR and SSIM. PSNR above 30 dB is generally considered acceptable quality. SSIM above 0.95 is very high structural similarity. An SSIM near 1.0 with a low PSNR is a sign the image structure is intact but pixel values shifted (like a brightness change).",
      useCases:
        "Evaluating compression codecs (JPEG, WebP). Comparing noise reduction filters on the same noisy input. Benchmarking image restoration algorithms. PSNR is the classic metric but SSIM is increasingly preferred because it correlates better with human ratings. These metrics are most useful when comparing methods, not as absolute pass/fail thresholds.",
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
