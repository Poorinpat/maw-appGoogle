import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  MapPin,
  MessageSquare,
  RotateCcw,
  Send,
  UserCheck,
  X,
} from 'lucide-react';
import type { CreateCommentPayload, Post, PostStatus, ResponderRole } from '../types';
import {
  RESPONDER_ROLE_OPTIONS,
  copyToClipboard,
  formatRelativeThaiTime,
  getSubjectStyle,
  getUrgencyStyle,
  sortCommentsChronological,
} from '../utils/helpers';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onToggleStatus: (postId: string, nextStatus: PostStatus) => Promise<boolean>;
  onAddComment: (payload: CreateCommentPayload) => Promise<boolean>;
  onNotify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function PostDetailModal({
  post,
  onClose,
  onToggleStatus,
  onAddComment,
  onNotify,
}: PostDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [responderName, setResponderName] = useState('');
  const [responderRole, setResponderRole] = useState<ResponderRole>('รุ่นพี่');
  const [message, setMessage] = useState('');
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    setCopied(false);
    setCommentError(null);
  }, [post?.id]);

  useEffect(() => {
    if (!post) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [post, onClose]);

  if (!post) return null;

  const subjectStyle = getSubjectStyle(post.subject);
  const urgencyStyle = getUrgencyStyle(post.urgency);
  const isResolved = post.status === 'resolved';
  const comments = sortCommentsChronological(post);

  const handleCopyContact = async () => {
    const ok = await copyToClipboard(post.contact_info);
    if (ok) {
      setCopied(true);
      onNotify('คัดลอกช่องทางติดต่อแล้ว!', 'success');
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      onNotify('ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกข้อความด้วยตนเอง', 'error');
    }
  };

  const handleStatusToggle = async () => {
    setUpdatingStatus(true);
    const nextStatus: PostStatus = isResolved ? 'open' : 'resolved';
    await onToggleStatus(post.id, nextStatus);
    setUpdatingStatus(false);
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!responderName.trim() || !message.trim()) {
      setCommentError('กรุณากรอกชื่อผู้ตอบและข้อความให้ครบถ้วน');
      return;
    }
    setCommentError(null);
    setSubmittingComment(true);

    const ok = await onAddComment({
      post_id: post.id,
      responder_name: responderName.trim(),
      responder_role: responderRole,
      message: message.trim(),
      is_volunteer: isVolunteer,
    });

    setSubmittingComment(false);
    if (ok) {
      setResponderName('');
      setMessage('');
      setIsVolunteer(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col max-h-[88vh]">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-medium ${subjectStyle.badge}`}
            >
              {post.subject}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-medium ${urgencyStyle.badge}`}
            >
              {post.urgency === 'ด่วนมาก' && (
                <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
              )}
              <span>{post.urgency}</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                isResolved
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isResolved ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>{isResolved ? 'ได้คนช่วยแล้ว' : 'กำลังหาคนช่วย'}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดรายละเอียดโพสต์"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          <div>
            <h2
              id="detail-modal-title"
              className="text-lg sm:text-xl font-bold text-slate-900 leading-snug"
            >
              {post.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
              <span>
                โดย <strong className="font-medium text-slate-800">{post.author_name}</strong> (
                {post.author_role})
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{post.location_type}</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>{formatRelativeThaiTime(post.created_at)}</span>
            </div>

            <div className="mt-3.5 text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {post.description}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">ช่องทางติดต่อผู้โพสต์</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5 break-all">
                {post.contact_info}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleCopyContact}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                )}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกช่องทางติดต่อ'}</span>
              </button>

              {!isResolved ? (
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={handleStatusToggle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  {updatingStatus ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>ปิดเคส (ได้คนช่วยแล้ว)</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={handleStatusToggle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  {updatingStatus ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>เปิดเคสอีกครั้ง</span>
                </button>
              )}
            </div>
          </div>

          <section aria-labelledby="comments-heading" className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <h3 id="comments-heading" className="text-sm font-semibold text-slate-900">
                ความคิดเห็นและผู้ช่วยติว ({comments.length})
              </h3>
            </div>

            {comments.length === 0 ? (
              <div className="text-center py-5 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-sm text-slate-500">
                ยังไม่มีความคิดเห็น — มาเป็นคนแรกที่ช่วยตอบหรืออาสาติวได้เลย
              </div>
            ) : (
              <ul className="space-y-2.5">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className={`rounded-xl border p-3.5 transition-colors ${
                      comment.is_volunteer
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200/80 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">
                          {comment.responder_name}
                        </span>
                        <span className="text-xs text-slate-500">{comment.responder_role}</span>
                        {comment.is_volunteer && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300/80 text-xs font-medium text-amber-900">
                            <UserCheck className="w-3 h-3 text-amber-700 shrink-0" aria-hidden="true" />
                            <span>อาสาช่วยติว</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatRelativeThaiTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {comment.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form
            onSubmit={handleCommentSubmit}
            noValidate
            className="pt-4 border-t border-slate-100 space-y-3"
          >
            <h4 className="text-sm font-semibold text-slate-900">ตอบกลับหรืออาสาช่วยติว</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="responder-name"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  ชื่อผู้ตอบ <span className="text-red-600">*</span>
                </label>
                <input
                  id="responder-name"
                  type="text"
                  required
                  value={responderName}
                  onChange={(e) => {
                    setResponderName(e.target.value);
                    if (commentError) setCommentError(null);
                  }}
                  placeholder="ชื่อเล่น หรือ ชื่อ-นามสกุล"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="responder-role"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  สถานะ
                </label>
                <select
                  id="responder-role"
                  value={responderRole}
                  onChange={(e) => setResponderRole(e.target.value as ResponderRole)}
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10"
                >
                  {RESPONDER_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="responder-message"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                ข้อความ / คำอธิบายเบื้องต้น <span className="text-red-600">*</span>
              </label>
              <textarea
                id="responder-message"
                rows={2}
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (commentError) setCommentError(null);
                }}
                placeholder="พิมพ์คำใบ้ แนวคิด หรือช่วงเวลาที่สะดวกช่วยติว..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10 leading-relaxed"
              />
            </div>

            <label className="flex items-center gap-3 p-2.5 px-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-50 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVolunteer}
                onChange={(e) => setIsVolunteer(e.target.checked)}
                className="w-4 h-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-amber-950">
                ฉันอาสาเป็นคนช่วยติวเรื่องนี้ (Offer to Tutor)
              </span>
            </label>

            {commentError && <p className="text-xs text-red-600">{commentError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {submittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{submittingComment ? 'กำลังส่ง...' : 'ส่งคำตอบ'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
