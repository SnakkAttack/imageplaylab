import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const MODULES = [
  { n: "01", name: "IMAGE BASICS",    ops: ["Grayscale", "RGB channels", "Brightness", "Contrast", "Gamma", "Invert", "Sepia"] },
  { n: "02", name: "NOISE",           ops: ["Gaussian", "Salt & Pepper", "Uniform"] },
  { n: "03", name: "FILTERING",       ops: ["Mean", "Gaussian", "Median", "Bilateral", "Sharpen", "Emboss"] },
  { n: "04", name: "EDGE DETECTION",  ops: ["Sobel", "Prewitt", "Scharr", "Laplacian", "Canny"] },
  { n: "05", name: "THRESHOLDING",    ops: ["Binary", "Inverse", "Otsu auto"] },
  { n: "06", name: "HISTOGRAM",       ops: ["View", "Equalization", "Stretch"] },
  { n: "07", name: "MORPHOLOGY",      ops: ["Erosion", "Dilation", "Opening", "Closing", "Gradient"] },
  { n: "08", name: "METRICS",         ops: ["MSE", "PSNR", "SSIM"] },
];

function LabMockup() {
  return (
    <div className="w-full rounded border border-night-400 overflow-hidden shadow-float bg-night-700">
      {/* Tab strip */}
      <div className="flex items-center h-8 bg-night-700 border-b border-night-400 px-2 gap-0.5">
        {["BASICS", "NOISE", "FILTER", "EDGES", "THRESH"].map((t, i) => (
          <div
            key={t}
            className={`relative h-6 px-2.5 flex items-center font-mono text-[8px] rounded ${
              i === 3
                ? "text-amber"
                : "text-night-100"
            }`}
          >
            {t}
            {i === 3 && (
              <span className="absolute bottom-0.5 left-2 right-2 h-px bg-amber rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center gap-2 px-3 bg-night-700 border-b border-night-400">
        <span className="font-mono text-[7px] text-night-100">Edge Detection</span>
        <span className="text-night-300 text-[7px]">·</span>
        <span className="font-mono text-[7px] text-amber">Canny</span>
        <div className="flex-1" />
        <span className="font-mono text-[7px] text-night-200">change image</span>
      </div>

      {/* Main: canvas + panel */}
      <div className="grid grid-cols-[1fr_90px]">
        {/* Canvas area: split view */}
        <div className="grid grid-cols-2 divide-x divide-night-400 bg-night-900" style={{ height: 140 }}>
          {/* Original */}
          <div className="flex items-center justify-center relative">
            <div className="absolute top-1.5 left-2 font-mono text-[6px] text-night-200 z-10">ORIGINAL</div>
            <div className="w-24 h-20 rounded overflow-hidden border border-night-400 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-night-500 to-night-700" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-night-400 to-transparent" />
              <div className="absolute bottom-4 left-3 w-8 h-6 bg-night-300" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
              <div className="absolute bottom-4 right-4 w-5 h-4 bg-night-300" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
              <div className="absolute top-2 right-3 w-3 h-3 rounded-full bg-amber/20 border border-amber/10" />
            </div>
          </div>
          {/* Processed */}
          <div className="flex items-center justify-center relative">
            <div className="absolute top-1.5 right-2 font-mono text-[6px] text-amber z-10">CANNY EDGES</div>
            <div className="w-24 h-20 rounded overflow-hidden border border-amber/30 relative bg-night-900">
              <div className="absolute bottom-4 left-3 w-8 h-6 border border-amber/50 bg-transparent" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
              <div className="absolute bottom-4 right-4 w-5 h-4 border border-amber/40 bg-transparent" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
              <div className="absolute bottom-4 left-0 right-0 h-px bg-amber/30" />
              <div className="absolute top-2 right-3 w-3 h-3 rounded-full border border-amber/30" />
            </div>
          </div>
        </div>

        {/* Instrument panel */}
        <div className="bg-night-700 border-l border-night-400 flex flex-col divide-y divide-night-400">
          {/* Controls */}
          <div className="p-2">
            <p className="font-mono text-[6px] text-night-100 uppercase tracking-widest mb-1.5">Operation</p>
            {["Sobel", "Laplacian", "Canny"].map((op, i) => (
              <div
                key={op}
                className={`flex items-center gap-1 px-1.5 py-1 rounded font-mono text-[7px] ${
                  i === 2 ? "text-amber bg-amber/8" : "text-night-100"
                }`}
              >
                {i === 2 && <span className="w-1 h-1 rounded-full bg-amber shrink-0" />}
                {op}
              </div>
            ))}
          </div>
          {/* Sliders */}
          <div className="p-2 flex flex-col gap-2">
            {[
              { label: "Low T", pct: 0.2 },
              { label: "High T", pct: 0.6 },
              { label: "Sigma", pct: 0.35 },
            ].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between mb-0.5">
                  <span className="font-mono text-[6px] text-night-100">{label}</span>
                  <span className="font-mono text-[6px] text-amber">{Math.round(pct * 100)}</span>
                </div>
                <div className="relative h-0.5 bg-night-400 rounded">
                  <div className="absolute left-0 top-0 h-full bg-amber rounded" style={{ width: `${pct * 100}%` }} />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber border border-night-700"
                    style={{ left: `calc(${pct * 100}% - 3px)` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Histogram */}
          <div className="p-2 flex-1">
            <p className="font-mono text-[6px] text-night-100 uppercase tracking-widest mb-1">Histogram</p>
            <div
              className="w-full rounded flex items-end gap-px"
              style={{ height: 28, background: "#0A0A0B" }}
            >
              {Array.from({ length: 20 }, (_, i) => {
                const h = Math.abs(Math.sin(i * 0.7 + 1) * 0.6 + Math.sin(i * 0.2) * 0.3 + 0.15);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ height: `${Math.min(h, 1) * 100}%`, background: "rgba(255,170,0,0.6)" }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-night-800 flex flex-col">
      <Header />

      {/* ── Hero: asymmetric editorial split ───────────────── */}
      <section className="flex flex-col md:flex-row min-h-[calc(100vh-44px)] border-b border-night-400">

        {/* Left: typographic statement */}
        <div className="w-full md:w-[42%] flex flex-col justify-center px-6 md:px-14 py-10 md:py-16 border-b md:border-b-0 md:border-r border-night-400">
          <span className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-10">
            v1.0 / Interactive Tool
          </span>

          <h1 className="font-mono font-bold text-night leading-[1.08] mb-6" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
            IMAGE<br />
            PROCESSING<br />
            MADE VISIBLE.
          </h1>

          <div className="w-full h-px bg-night-400 mb-6" />

          <p className="font-mono text-xs text-night-50 leading-[1.8] mb-10">
            Upload any image. Apply real algorithms.<br />
            Understand exactly what changed, and why.<br />
            All processing runs in your browser.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/lab"
              className="self-start flex items-center gap-3 font-mono text-sm font-bold text-night-800 bg-amber hover:bg-amber-100 transition-colors px-5 py-2.5 rounded"
            >
              Open Lab
              <span className="text-xs">→</span>
            </Link>
            <Link
              href="/about"
              className="self-start font-mono text-xs text-night-100 hover:text-amber transition-colors"
            >
              About the project
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-12 pt-8 border-t border-night-400">
            {[
              { n: "8", label: "Modules" },
              { n: "30+", label: "Operations" },
              { n: "0", label: "Server calls" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-mono text-lg font-bold text-amber">{n}</p>
                <p className="font-mono text-3xs text-night-100 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: app preview */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-night-900">
          <div className="w-full max-w-md">
            <LabMockup />
            <p className="font-mono text-3xs text-night-200 text-center mt-4">
              Real app. Try it with your own images.
            </p>
          </div>
        </div>
      </section>

      {/* ── Module manifest ──────────────────────────────────── */}
      <section className="border-b border-night-400">
        <div className="px-6 md:px-14 py-8">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Curriculum</p>
          <div className="flex flex-col">
            {MODULES.map((m, i) => (
              <Link
                href="/lab"
                key={m.n}
                className="group flex items-start gap-4 md:gap-6 py-3.5 border-b border-night-400 last:border-0 hover:bg-night-700 -mx-6 px-6 md:-mx-14 md:px-14 transition-colors"
              >
                <span className="font-mono text-3xs text-amber/50 group-hover:text-amber transition-colors w-6 shrink-0 mt-0.5">
                  {m.n}
                </span>
                <span className="font-mono text-xs text-night group-hover:text-amber transition-colors w-28 md:w-40 shrink-0">
                  {m.name}
                </span>
                <span className="font-mono text-3xs text-night-100 group-hover:text-night-50 transition-colors leading-relaxed hidden sm:block">
                  {m.ops.join("  ·  ")}
                </span>
                <span className="ml-auto font-mono text-3xs text-night-400 group-hover:text-amber transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="border-b border-night-400">
        <div className="px-6 md:px-14 py-12">
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-8">Workflow</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-0 sm:divide-x sm:divide-night-400">
            {[
              { n: "01", label: "Upload",    sub: "Any image,\nor use a sample" },
              { n: "02", label: "Select",    sub: "Pick a module\nfrom the tab strip" },
              { n: "03", label: "Adjust",    sub: "Move sliders,\nsee live output" },
              { n: "04", label: "Compare",   sub: "Split view or\nslider comparison" },
              { n: "05", label: "Understand", sub: "Read the math\nand intuition" },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-2 sm:gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <span className="font-mono text-2xs text-amber">{step.n}</span>
                <span className="font-mono text-sm font-bold text-night">{step.label}</span>
                <span className="font-mono text-3xs text-night-100 leading-relaxed whitespace-pre-line">{step.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical spec ───────────────────────────────────── */}
      <section className="border-b border-night-400">
        <div className="px-6 md:px-14 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Architecture</p>
            <div className="flex flex-col gap-0 divide-y divide-night-400">
              {[
                { k: "Framework",    v: "Next.js 16 + Turbopack" },
                { k: "Language",     v: "TypeScript (strict)" },
                { k: "Styling",      v: "Tailwind CSS" },
                { k: "Processing",   v: "Canvas API (client-side)" },
                { k: "Server",       v: "None required" },
                { k: "Auth / DB",    v: "None" },
                { k: "Deploy",       v: "Vercel" },
              ].map(({ k, v }) => (
                <div key={k} className="flex items-baseline gap-4 py-2.5">
                  <span className="font-mono text-3xs text-night-100 w-32 shrink-0">{k}</span>
                  <span className="font-mono text-3xs text-night-50">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-6">Algorithms (from scratch)</p>
            <div className="flex flex-col gap-0 divide-y divide-night-400">
              {[
                "Gaussian / Mean / Median / Bilateral convolution",
                "Full Canny pipeline: smooth → Sobel → NMS → hysteresis",
                "Otsu threshold via inter-class variance",
                "CDF-based histogram equalization",
                "Morphological erosion, dilation, opening, closing",
                "MSE, PSNR (dB), global SSIM approximation",
              ].map((a) => (
                <div key={a} className="py-2.5 flex items-start gap-2">
                  <span className="font-mono text-3xs text-amber/40 shrink-0 mt-0.5">-</span>
                  <span className="font-mono text-3xs text-night-50 leading-relaxed">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-14 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 justify-between">
        <div>
          <p className="font-mono text-3xs text-amber uppercase tracking-[0.2em] mb-3">Ready?</p>
          <p className="font-mono text-2xl font-bold text-night leading-tight">
            No sign-up. No install.<br />Runs entirely in your browser.
          </p>
        </div>
        <Link
          href="/lab"
          className="flex items-center gap-3 font-mono text-sm font-bold text-night-800 bg-amber hover:bg-amber-100 transition-colors px-6 py-3 rounded"
        >
          Open Lab
          <span>→</span>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
