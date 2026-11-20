import { GraduationCap, Plus } from 'lucide-react';

interface NavbarProps {
  onCreateClick: () => void;
}

export function Navbar({ onCreateClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-3 min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 rounded-lg"
        >
          <span
            className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs"
            aria-hidden="true"
          >
            <GraduationCap className="w-5 h-5" />
          </span>
          <span className="flex items-baseline gap-2 min-w-0">
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              MAW
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap hidden sm:inline">
              MWIT-anywhere
            </span>
          </span>
        </a>

        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-sm font-medium rounded-lg px-3.5 sm:px-4 py-2 shadow-xs transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>โพสต์ขอความช่วยเหลือ</span>
        </button>
      </div>
    </header>
  );
}
