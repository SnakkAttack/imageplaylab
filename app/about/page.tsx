import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "About | Image Play Lab",
  description: "About Image Play Lab: an interactive image processing educational tool.",
};

const CONCEPTS = [
  { n: "01", name: "Pixel model",         detail: "RGB color space, luminance weighting, channel isolation" },
  { n: "02", name: "Noise models",         detail: "Gaussian (additive), salt-and-pepper (impulsive), uniform" },
  { n: "03", name: "Spatial filtering",    detail: "Linear convolution, box / Gaussian / median kernels" },
  { n: "04", name: "Edge detection",       detail: "Sobel, Laplacian, full Canny pipeline" },
  { n: "05", name: "Thresholding",         detail: "Binary, inverse, Otsu inter-class variance" },
  { n: "06", name: "Histogram analysis",   detail: "Distributions, CDF-based equalization" },
  { n: "07", name: "Morphological ops",    detail: "Erosion, dilation, opening, closing" },
  { n: "08", name: "Quality metrics",      detail: "MSE, PSNR in dB, structural similarity (SSIM)" },
];

const TECH = [
  { name: "Next.js 16",   role: "App framework + Turbopack" },
  { name: "TypeScript",   role: "Strict mode throughout" },
  { name: "Tailwind CSS", role: "Utility-first styling" },
  { name: "Canvas API",   role: "All processing client-side" },
  { name: "Vercel",       role: "Zero-config deployment" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-night-800 flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">

        {/* Title */}
        <div className="mb-14">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">About</p>
          <h1 className="font-mono text-3xl font-bold text-night leading-tight mb-6">Image Play Lab</h1>
          <div className="w-full h-px bg-night-400 mb-6" />
          <p className="font-mono text-xs text-night-50 leading-[1.9]">
            A project for Image Processing. Built to make abstract algorithms tangible:
            upload a real image, adjust real parameters, and see the math come alive in the browser.
          </p>
        </div>

        {/* Contributors */}
        <section className="mb-14">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Contributors</p>
          <div className="flex flex-col divide-y divide-night-400 border-t border-night-400">
            <div className="flex items-start gap-6 py-4">
              <span className="font-mono text-2xs text-night w-16 shrink-0 pt-0.5">Gage</span>
              <div>
                <p className="font-mono text-xs text-night mb-1">Backend + Deployment</p>
                <p className="font-mono text-3xs text-night-100 leading-relaxed">
                  All image processing algorithms in TypeScript from scratch (filtering, edge detection, Otsu
                  thresholding, morphology, metrics), the data layer, and Vercel deployment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 py-4">
              <span className="font-mono text-2xs text-night w-16 shrink-0 pt-0.5">Sam</span>
              <div>
                <p className="font-mono text-xs text-night mb-1">Frontend + UI/UX</p>
                <p className="font-mono text-3xs text-night-100 leading-relaxed">
                  Component architecture, visual design system (dark theme, amber accent, mono typography),
                  image workspace (split/slider/result views), and histogram rendering.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="mb-14">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Why I built this</p>
          <div className="flex flex-col gap-4 font-mono text-xs text-night-50 leading-[1.9]">
            <p>
              Image processing is one of those subjects where the gap between reading about it
              and <em className="text-night not-italic">understanding</em> it is wide. A Gaussian blur formula on
              a slide is abstract. A slider that lets you move σ from 0.5 to 10 and watch detail
              dissolve. That sticks.
            </p>
            <p>
              Image Play Lab is built for that gap. Every module combines the intuition and the math,
              then puts you in control of the parameters. You can see that a median filter outperforms
              Gaussian blur on salt-and-pepper noise in seconds, not after three lectures.
            </p>
          </div>
        </section>

        {/* Concepts */}
        <section className="mb-14">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Concepts covered</p>
          <div className="flex flex-col divide-y divide-night-400 border-t border-night-400">
            {CONCEPTS.map((c) => (
              <div key={c.n} className="flex items-start gap-6 py-3">
                <span className="font-mono text-3xs text-amber/50 w-6 shrink-0 mt-0.5">{c.n}</span>
                <span className="font-mono text-2xs text-night w-36 shrink-0">{c.name}</span>
                <span className="font-mono text-3xs text-night-100 leading-relaxed">{c.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical approach */}
        <section className="mb-14">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Technical approach</p>
          <div className="font-mono text-xs text-night-50 leading-[1.9] flex flex-col gap-4 mb-8">
            <p>
              Every algorithm is implemented from scratch in TypeScript using only the browser&apos;s
              Canvas API. No image-processing library; the code itself is readable and educational.
              Processing is fully client-side: images never leave the device.
            </p>
            <p>
              Slider updates are debounced to avoid blocking the main thread. Images above 800 px
              are downscaled on load for real-time responsiveness.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-night-400 border-t border-night-400">
            {TECH.map((t) => (
              <div key={t.name} className="flex items-center gap-6 py-3">
                <span className="font-mono text-2xs text-night w-32 shrink-0">{t.name}</span>
                <span className="font-mono text-3xs text-night-100">{t.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-14">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Architecture</p>
          <div className="bg-night-900 border border-night-400 rounded p-5 overflow-x-auto">
            <pre className="font-mono text-3xs text-night-100 leading-relaxed">{`app/
  page.tsx                 Home / landing
  lab/page.tsx             Interactive lab
  about/page.tsx           This page
components/
  layout/                  Header · Footer
  lab/                     LabShell · ImageUploader · ImageWorkspace
  │                        ModuleTabs · ControlPanel · ExplanationCard
  │                        HistogramView · MetricCard
  ui/                      SliderControl · SegmentedControl · Badge
lib/image-processing/
  canvas-utils.ts          Shared canvas helpers
  basics / noise / filtering / edge-detection
  thresholding / histogram / morphology / metrics
  processor.ts             Operation router
data/modules.ts            Module definitions + educational copy
types/image.ts             TypeScript interfaces`}</pre>
          </div>
        </section>

        {/* CTA */}
        <div className="border border-night-400 rounded p-8 flex flex-col items-center text-center gap-5 bg-night-700">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em]">Try it yourself</p>
          <p className="font-mono text-lg font-bold text-night leading-tight">
            No login. No install.<br />Open the lab and start learning.
          </p>
          <Link
            href="/lab"
            className="flex items-center gap-3 font-mono text-sm font-bold text-night-800 bg-amber hover:bg-amber-100 transition-colors px-6 py-2.5 rounded"
          >
            Open Lab →
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
