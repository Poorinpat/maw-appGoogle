interface StatsOverviewProps {
  total: number;
  open: number;
  resolved: number;
  loading: boolean;
}

export function StatsOverview({ total, open, resolved, loading }: StatsOverviewProps) {
  return (
    <section aria-labelledby="hero-heading" className="pt-7 pb-5">
      <div className="max-w-3xl">
        <h1
          id="hero-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 text-balance leading-snug"
        >
          พื้นที่แบ่งปันความรู้ ถาม-ตอบ และหาคนช่วยติวสำหรับชาว MWIT
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
          ติดตรงไหน ไม่เข้าใจเรื่องอะไร โพสต์ถามเพื่อน รุ่นพี่ หรืออาจารย์ได้เลย
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-5">
        <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap truncate">
            โพสต์ทั้งหมด
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums mt-1">
            {loading ? '—' : total}
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap truncate">
            กำลังหาคนช่วย
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900 tabular-nums mt-1">
            {loading ? '—' : open}
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap truncate">
            ได้คนช่วยแล้ว
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums mt-1">
            {loading ? '—' : resolved}
          </p>
        </div>
      </div>
    </section>
  );
}
