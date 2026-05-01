import Link from "next/link";

interface HeaderProps {
  lab?: boolean;
}

export function Header({ lab = false }: HeaderProps) {
  if (lab) {
    return (
      <header className="h-11 flex items-center shrink-0 bg-night-700 border-b border-night-400 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 rounded bg-amber flex items-center justify-center shrink-0">
            <span className="text-night-800 text-[9px] font-black tracking-tighter">IP</span>
          </div>
          <span className="font-mono text-2xs text-night-50 group-hover:text-night transition-colors">
            Image Play Lab
          </span>
        </Link>
        <div className="flex-1" />
        <nav className="flex items-center gap-0.5">
          <Link href="/about" className="h-6 px-2.5 flex items-center font-mono text-2xs text-night-100 hover:text-night transition-colors rounded">
            About
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="h-11 flex items-center shrink-0 bg-night-700 border-b border-night-400 px-6">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-5 h-5 rounded bg-amber flex items-center justify-center shrink-0">
          <span className="text-night-800 text-[9px] font-black tracking-tighter">IP</span>
        </div>
        <span className="font-mono text-2xs text-night-50 group-hover:text-night transition-colors">
          Image Play Lab
        </span>
      </Link>
      <div className="flex-1" />
      <nav className="flex items-center gap-0.5">
        <Link href="/"     className="hidden sm:flex h-7 px-3 items-center font-mono text-2xs text-night-100 hover:text-night transition-colors rounded">Home</Link>
        <Link href="/about" className="h-7 px-3 flex items-center font-mono text-2xs text-night-100 hover:text-night transition-colors rounded">About</Link>
        <Link href="/lab"
          className="ml-2 h-7 px-3 flex items-center font-mono text-2xs font-bold text-night-800 bg-amber hover:bg-amber-100 transition-colors rounded"
        >
          Open Lab →
        </Link>
      </nav>
    </header>
  );
}
