export type PostStatus = 'open' | 'resolved';

export type SubjectType =
  | 'คณิตศาสตร์'
  | 'ฟิสิกส์'
  | 'เคมี'
  | 'ชีววิทยา'
  | 'คอมพิวเตอร์'
  | 'ภาษาอังกฤษ'
  | 'อื่นๆ';

export type UrgencyType = 'การบ้าน/ทั่วไป' | 'เตรียมสอบ' | 'ด่วนมาก';

export type LocationType =
  | 'ออนไลน์ (Discord / Meet)'
  | 'หอพัก'
  | 'ห้องสมุด / อาคารเรียน'
  | 'ได้ทั้งออนไลน์และเจอตัว';

export type AuthorRole = 'นักเรียน ม.4' | 'นักเรียน ม.5' | 'นักเรียน ม.6' | 'อาจารย์';

export type ResponderRole = 'รุ่นพี่' | 'เพื่อนร่วมรุ่น' | 'อาจารย์';

export type SortOption = 'newest' | 'urgent';

export interface Comment {
  id: string;
  created_at: string;
  post_id: string;
  responder_name: string;
  responder_role: string;
  message: string;
  is_volunteer: boolean;
}

export interface Post {
  id: string;
  created_at: string;
  title: string;
  description: string;
  subject: string;
  urgency: string;
  location_type: string;
  author_name: string;
  author_role: string;
  contact_info: string;
  status: PostStatus;
  comments?: Comment[];
}

export interface CreatePostPayload {
  title: string;
  subject: SubjectType;
  urgency: UrgencyType;
  location_type: LocationType;
  description: string;
  author_name: string;
  author_role: AuthorRole;
  contact_info: string;
}

export interface CreateCommentPayload {
  post_id: string;
  responder_name: string;
  responder_role: ResponderRole;
  message: string;
  is_volunteer: boolean;
}

export interface FilterState {
  search: string;
  subject: string;
  status: 'all' | PostStatus;
  sort: SortOption;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
