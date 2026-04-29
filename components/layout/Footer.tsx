import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-night-400 bg-night-700">
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber flex items-center justify-center shrink-0">
            <span className="text-night-800 text-[8px] font-black tracking-tighter">IP</span>
          </div>
          <span className="font-mono text-2xs text-night-50">Image Play Lab</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/"     className="font-mono text-3xs text-night-100 hover:text-amber transition-colors">Home</Link>
          <Link href="/lab"  className="font-mono text-3xs text-night-100 hover:text-amber transition-colors">Lab</Link>
          <Link href="/about" className="font-mono text-3xs text-night-100 hover:text-amber transition-colors">About</Link>
        </nav>
        <span className="font-mono text-3xs text-night-200">
          Interactive image processing, built for learning
        </span>
      </div>
    </footer>
  );
}
