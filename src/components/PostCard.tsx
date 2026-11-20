import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import type { Post } from '../types';
import {
  formatRelativeThaiTime,
  getShortLocationLabel,
  getSubjectStyle,
  getUrgencyStyle,
  hasVolunteer,
} from '../utils/helpers';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
}

export function PostCard({ post, onSelect }: PostCardProps) {
  const subjectStyle = getSubjectStyle(post.subject);
  const urgencyStyle = getUrgencyStyle(post.urgency);
  const isResolved = post.status === 'resolved';
  const volunteered = hasVolunteer(post);
  const commentCount = post.comments?.length ?? 0;

  return (
    <article className="h-full">
      <button
        type="button"
        onClick={() => onSelect(post)}
        className={`group w-full h-full flex flex-col justify-between text-left bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 ${
          isResolved ? 'opacity-85 hover:opacity-100' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap ${subjectStyle.badge}`}
              >
                {post.subject}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap ${urgencyStyle.badge}`}
              >
                {post.urgency === 'ด่วนมาก' && (
                  <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                )}
                <span>{post.urgency}</span>
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap shrink-0 ${
                isResolved ? 'text-slate-500' : 'text-emerald-700'
              }`}
            >
              {isResolved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              )}
              <span>{isResolved ? 'ได้คนช่วยแล้ว' : 'กำลังหาคนช่วย'}</span>
            </span>
          </div>

          <h3 className="mt-3 text-[15px] sm:text-base font-semibold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>

          <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {post.description}
          </p>

          {volunteered && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/90 text-xs font-medium text-amber-800">
              <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
              <span>มีคนอาสาติวแล้ว</span>
            </div>
          )}
        </div>

        <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 min-w-0 shrink-0 max-w-[46%]">
            <span className="font-medium text-slate-700 truncate">{post.author_name}</span>
            <span aria-hidden="true" className="text-slate-300 shrink-0">
              ·
            </span>
            <span className="whitespace-nowrap shrink-0 text-slate-500">{post.author_role}</span>
          </div>

          <div className="flex items-center gap-2 min-w-0 justify-end">
            <span className="inline-flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{getShortLocationLabel(post.location_type)}</span>
            </span>
            <span
              className="inline-flex items-center gap-1 tabular-nums whitespace-nowrap shrink-0"
              title={`${commentCount} ความคิดเห็น`}
            >
              <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{commentCount}</span>
            </span>
            <span className="whitespace-nowrap shrink-0 text-slate-400">
              {formatRelativeThaiTime(post.created_at)}
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between min-h-[212px] animate-pulse"
      aria-hidden="true"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-slate-100 rounded-md" />
            <div className="h-5 w-20 bg-slate-100 rounded-md" />
          </div>
          <div className="h-4 w-20 bg-slate-100 rounded-md" />
        </div>
        <div className="h-5 w-4/5 bg-slate-100 rounded mt-3.5" />
        <div className="h-4 w-full bg-slate-100 rounded mt-2.5" />
        <div className="h-4 w-2/3 bg-slate-100 rounded mt-1.5" />
      </div>
      <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3.5 w-28 bg-slate-100 rounded" />
        <div className="h-3.5 w-24 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
