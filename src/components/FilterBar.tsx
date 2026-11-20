import { ArrowUpDown, Search, X } from 'lucide-react';
import type { FilterState, PostStatus, SortOption } from '../types';
import { SUBJECT_FILTERS, getSubjectStyle } from '../utils/helpers';

interface FilterBarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

const STATUS_TABS: { value: 'all' | PostStatus; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'open', label: 'กำลังหาคนช่วย' },
  { value: 'resolved', label: 'ได้คนช่วยแล้ว' },
];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <section aria-label="ค้นหาและตัวกรอง" className="space-y-3 pb-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="ค้นหาหัวข้อ รายละเอียด หรือชื่อผู้โพสต์..."
            aria-label="ค้นหาโพสต์"
            className="w-full h-10 pl-10 pr-9 bg-white border border-slate-200/90 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10 transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              aria-label="ล้างคำค้นหา"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <div
            role="group"
            aria-label="สถานะโพสต์"
            className="inline-flex items-center p-1 bg-slate-100 border border-slate-200/70 rounded-lg overflow-x-auto max-w-full"
          >
            {STATUS_TABS.map((tab) => {
              const active = filters.status === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...filters, status: tab.value })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-800 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative shrink-0">
            <ArrowUpDown
              className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
              aria-label="เรียงลำดับโพสต์"
              className="h-10 pl-8 pr-8 bg-white border border-slate-200/90 rounded-lg text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10 cursor-pointer"
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="urgent">ด่วนมากก่อน</option>
            </select>
          </div>
        </div>
      </div>

      <div
        role="group"
        aria-label="กรองตามรายวิชา"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        {SUBJECT_FILTERS.map((subject) => {
          const active = filters.subject === subject;
          const style = getSubjectStyle(subject);
          const activeClass =
            subject === 'ทั้งหมด'
              ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
              : `${style.activeFilter} shadow-xs`;
          const idleClass =
            subject === 'ทั้งหมด'
              ? 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
              : `${style.badge} hover:opacity-90`;

          return (
            <button
              key={subject}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...filters, subject })}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 ${
                active ? activeClass : idleClass
              }`}
            >
              {subject}
            </button>
          );
        })}
      </div>
    </section>
  );
}
