import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, X } from 'lucide-react';
import type {
  AuthorRole,
  CreatePostPayload,
  LocationType,
  SubjectType,
  UrgencyType,
} from '../types';
import {
  AUTHOR_ROLE_OPTIONS,
  LOCATION_OPTIONS,
  SUBJECT_OPTIONS,
  URGENCY_OPTIONS,
} from '../utils/helpers';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePostPayload) => Promise<boolean>;
}

interface FormErrors {
  title?: string;
  description?: string;
  author_name?: string;
  contact_info?: string;
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectType>('คณิตศาสตร์');
  const [urgency, setUrgency] = useState<UrgencyType>('การบ้าน/ทั่วไป');
  const [locationType, setLocationType] = useState<LocationType>('ออนไลน์ (Discord / Meet)');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<AuthorRole>('นักเรียน ม.4');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = 'กรุณากรอกหัวข้อเรื่องที่อยากให้ช่วย';
    if (!description.trim()) next.description = 'กรุณากรอกรายละเอียดเนื้อหาที่ไม่เข้าใจ';
    if (!authorName.trim()) next.author_name = 'กรุณากรอกชื่อผู้โพสต์';
    if (!contactInfo.trim()) next.contact_info = 'กรุณากรอกช่องทางติดต่อกลับ';
    return next;
  };

  const resetForm = () => {
    setTitle('');
    setSubject('คณิตศาสตร์');
    setUrgency('การบ้าน/ทั่วไป');
    setLocationType('ออนไลน์ (Discord / Meet)');
    setDescription('');
    setAuthorName('');
    setAuthorRole('นักเรียน ม.4');
    setContactInfo('');
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const ok = await onSubmit({
      title: title.trim(),
      subject,
      urgency,
      location_type: locationType,
      description: description.trim(),
      author_name: authorName.trim(),
      author_role: authorRole,
      contact_info: contactInfo.trim(),
    });
    setSubmitting(false);

    if (ok) {
      resetForm();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 id="create-post-title" className="text-lg font-bold text-slate-900">
              โพสต์ขอความช่วยเหลือ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ระบุหัวข้อและช่องทางติดต่อเพื่อให้เพื่อน รุ่นพี่ หรืออาจารย์ช่วยตอบได้ตรงจุด
            </p>
          </div>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            aria-label="ปิดหน้าต่าง"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 mb-1.5">
              หัวข้อเรื่องที่อยากให้ช่วย <span className="text-red-600">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="เช่น ช่วยอธิบายเรื่องสมดุลเคมี หรือขอแนวโจทย์ฟิสิกส์บทการเคลื่อนที่"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-slate-200 focus:border-blue-800 focus:ring-blue-900/10'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="post-subject"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                รายวิชา
              </label>
              <select
                id="post-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10"
              >
                {SUBJECT_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-urgency"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                ระดับความด่วน
              </label>
              <select
                id="post-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyType)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10"
              >
                {URGENCY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="post-location"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              รูปแบบ / สถานที่ที่สะดวก
            </label>
            <select
              id="post-location"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10"
            >
              {LOCATION_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="post-description"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              รายละเอียดเนื้อหาที่ไม่เข้าใจ <span className="text-red-600">*</span>
            </label>
            <textarea
              id="post-description"
              rows={4}
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="อธิบายจุดที่ติดหรือหัวข้อที่อยากให้ช่วยติวเพิ่มเติม..."
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors leading-relaxed ${
                errors.description
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-slate-200 focus:border-blue-800 focus:ring-blue-900/10'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="post-author-name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                ชื่อผู้โพสต์ <span className="text-red-600">*</span>
              </label>
              <input
                id="post-author-name"
                type="text"
                required
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  if (errors.author_name) setErrors({ ...errors, author_name: undefined });
                }}
                placeholder="ชื่อเล่น หรือ ชื่อ-นามสกุล"
                className={`w-full h-10 px-3.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.author_name
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-blue-800 focus:ring-blue-900/10'
                }`}
              />
              {errors.author_name && (
                <p className="text-xs text-red-600 mt-1">{errors.author_name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="post-author-role"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                สถานะ
              </label>
              <select
                id="post-author-role"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value as AuthorRole)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/10"
              >
                {AUTHOR_ROLE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="post-contact"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              ช่องทางติดต่อกลับ <span className="text-red-600">*</span>
            </label>
            <input
              id="post-contact"
              type="text"
              required
              value={contactInfo}
              onChange={(e) => {
                setContactInfo(e.target.value);
                if (errors.contact_info) setErrors({ ...errors, contact_info: undefined });
              }}
              placeholder="เช่น Line ID: @name, IG: name, หรือ Discord"
              className={`w-full h-10 px-3.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.contact_info
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-slate-200 focus:border-blue-800 focus:ring-blue-900/10'
              }`}
            />
            {errors.contact_info && (
              <p className="text-xs text-red-600 mt-1">{errors.contact_info}</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              <span>{submitting ? 'กำลังโพสต์...' : 'โพสต์ขอความช่วยเหลือ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
