import type {
  AuthorRole,
  FilterState,
  LocationType,
  Post,
  ResponderRole,
  SubjectType,
  UrgencyType,
} from '../types';

export const SUBJECT_FILTERS: readonly string[] = [
  'ทั้งหมด',
  'คณิตศาสตร์',
  'ฟิสิกส์',
  'เคมี',
  'ชีววิทยา',
  'คอมพิวเตอร์',
  'ภาษาอังกฤษ',
  'อื่นๆ',
];

export const SUBJECT_OPTIONS: readonly SubjectType[] = [
  'คณิตศาสตร์',
  'ฟิสิกส์',
  'เคมี',
  'ชีววิทยา',
  'คอมพิวเตอร์',
  'ภาษาอังกฤษ',
  'อื่นๆ',
];

export const URGENCY_OPTIONS: readonly UrgencyType[] = [
  'การบ้าน/ทั่วไป',
  'เตรียมสอบ',
  'ด่วนมาก',
];

export const LOCATION_OPTIONS: readonly LocationType[] = [
  'ออนไลน์ (Discord / Meet)',
  'หอพัก',
  'ห้องสมุด / อาคารเรียน',
  'ได้ทั้งออนไลน์และเจอตัว',
];

export const AUTHOR_ROLE_OPTIONS: readonly AuthorRole[] = [
  'นักเรียน ม.4',
  'นักเรียน ม.5',
  'นักเรียน ม.6',
  'อาจารย์',
];

export const RESPONDER_ROLE_OPTIONS: readonly ResponderRole[] = [
  'รุ่นพี่',
  'เพื่อนร่วมรุ่น',
  'อาจารย์',
];

export function formatRelativeThaiTime(dateInput: string | Date, now: Date = new Date()): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) {
    return 'เมื่อสักครู่';
  }

  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'เมื่อสักครู่';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} นาทีที่แล้ว`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  }

  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }).format(date);
}

export interface SubjectStyle {
  badge: string;
  activeFilter: string;
  dot: string;
}

const SUBJECT_STYLES: Record<string, SubjectStyle> = {
  คณิตศาสตร์: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200/70',
    activeFilter: 'bg-blue-900 text-white border-blue-900',
    dot: 'bg-blue-600',
  },
  ฟิสิกส์: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    activeFilter: 'bg-indigo-700 text-white border-indigo-700',
    dot: 'bg-indigo-600',
  },
  เคมี: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    activeFilter: 'bg-emerald-700 text-white border-emerald-700',
    dot: 'bg-emerald-600',
  },
  ชีววิทยา: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200/70',
    activeFilter: 'bg-teal-700 text-white border-teal-700',
    dot: 'bg-teal-600',
  },
  คอมพิวเตอร์: {
    badge: 'bg-violet-50 text-violet-700 border-violet-200/70',
    activeFilter: 'bg-violet-700 text-white border-violet-700',
    dot: 'bg-violet-600',
  },
  ภาษาอังกฤษ: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200/70',
    activeFilter: 'bg-rose-700 text-white border-rose-700',
    dot: 'bg-rose-600',
  },
  อื่นๆ: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200/80',
    activeFilter: 'bg-slate-800 text-white border-slate-800',
    dot: 'bg-slate-500',
  },
};

export function getSubjectStyle(subject: string): SubjectStyle {
  return SUBJECT_STYLES[subject] || SUBJECT_STYLES['อื่นๆ'];
}

export interface UrgencyStyle {
  badge: string;
  priority: number;
}

export function getUrgencyStyle(urgency: string): UrgencyStyle {
  switch (urgency) {
    case 'ด่วนมาก':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200/80',
        priority: 3,
      };
    case 'เตรียมสอบ':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
        priority: 2,
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200/80',
        priority: 1,
      };
  }
}

export function getShortLocationLabel(locationType: string): string {
  if (locationType.startsWith('ออนไลน์')) {
    return 'ออนไลน์';
  }
  if (locationType.startsWith('ห้องสมุด')) {
    return 'ห้องสมุด/อาคาร';
  }
  if (locationType.startsWith('ได้ทั้ง')) {
    return 'ออนไลน์/เจอตัว';
  }
  return locationType;
}

export function hasVolunteer(post: Post): boolean {
  return Boolean(post.comments?.some((comment) => comment.is_volunteer));
}

export function sortCommentsChronological(post: Post) {
  return [...(post.comments ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function computeStats(posts: Post[]) {
  const total = posts.length;
  const open = posts.filter((p) => p.status === 'open').length;
  const resolved = posts.filter((p) => p.status === 'resolved').length;
  return { total, open, resolved };
}

export function filterAndSortPosts(posts: Post[], filters: FilterState): Post[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = posts.filter((post) => {
    if (filters.subject !== 'ทั้งหมด' && post.subject !== filters.subject) {
      return false;
    }

    if (filters.status !== 'all' && post.status !== filters.status) {
      return false;
    }

    if (query) {
      const matchesTitle = post.title.toLowerCase().includes(query);
      const matchesDesc = post.description.toLowerCase().includes(query);
      const matchesAuthor = post.author_name.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesAuthor) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'urgent') {
      const priorityDiff =
        getUrgencyStyle(b.urgency).priority - getUrgencyStyle(a.urgency).priority;
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return copied;
    } catch {
      return false;
    }
  }

  return false;
}
