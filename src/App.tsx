import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, RefreshCw, RotateCcw } from 'lucide-react';
import { supabase } from './lib/supabase';
import { SEED_POSTS } from './data/seedPosts';
import type {
  Comment,
  CreateCommentPayload,
  CreatePostPayload,
  FilterState,
  Post,
  PostStatus,
  ToastItem,
} from './types';
import { computeStats, filterAndSortPosts } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { PostCard, PostCardSkeleton } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { ToastContainer } from './components/Toast';

const LOCAL_PREVIEW_STORAGE_KEY = 'maw_mwit_preview_posts_v1';

const INITIAL_FILTERS: FilterState = {
  search: '',
  subject: 'ทั้งหมด',
  status: 'all',
  sort: 'newest',
};

function loadLocalPreviewPosts(): Post[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_PREVIEW_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Post[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return SEED_POSTS;
}

function saveLocalPreviewPosts(posts: Post[]) {
  try {
    window.localStorage.setItem(LOCAL_PREVIEW_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Ignore storage errors
  }
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [usingPreviewData, setUsingPreviewData] = useState(false);

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, comments(*)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts((data as Post[]) || []);
      setUsingPreviewData(false);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const preview = loadLocalPreviewPosts();
      setPosts(preview);
      setUsingPreviewData(true);

      if (code === '42501') {
        setFetchError(
          'ฐานข้อมูล Supabase ยังไม่ได้เปิดสิทธิ์การอ่าน/เขียนสำหรับผู้เยี่ยมชม (ตาราง posts) ขณะนี้จึงแสดงข้อมูลจำลองเพื่อให้ทดลองใช้งานได้ทันที'
        );
      } else {
        setFetchError(
          'ไม่สามารถเชื่อมต่อ Supabase ได้ในขณะนี้ ขณะนี้แสดงข้อมูลจำลองเพื่อให้ทดลองใช้งานได้ทันที'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const stats = useMemo(() => computeStats(posts), [posts]);

  const filteredPosts = useMemo(() => filterAndSortPosts(posts, filters), [posts, filters]);

  const selectedPost = useMemo(
    () => posts.find((item) => item.id === selectedPostId) ?? null,
    [posts, selectedPostId]
  );

  const handleCreatePost = async (payload: CreatePostPayload): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...payload, status: 'open' }])
        .select('*, comments(*)')
        .single();

      if (error) {
        throw error;
      }

      const created: Post = {
        ...(data as Post),
        comments: (data as Post).comments ?? [],
      };
      setPosts((prev) => [created, ...prev]);
      setUsingPreviewData(false);
      setFetchError(null);
      showToast('โพสต์ขอความช่วยเหลือเรียบร้อยแล้ว!', 'success');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (usingPreviewData || code === '42501') {
        const localPost: Post = {
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...payload,
          status: 'open',
          comments: [],
        };
        setPosts((prev) => {
          const next = [localPost, ...prev];
          saveLocalPreviewPosts(next);
          return next;
        });
        setUsingPreviewData(true);
        showToast('โพสต์ขอความช่วยเหลือเรียบร้อยแล้ว!', 'success');
        return true;
      }

      showToast('ไม่สามารถโพสต์ขอความช่วยเหลือได้ กรุณาลองใหม่อีกครั้ง', 'error');
      return false;
    }
  };

  const handleToggleStatus = async (postId: string, nextStatus: PostStatus): Promise<boolean> => {
    try {
      if (!postId.startsWith('seed-') && !postId.startsWith('local-')) {
        const { error } = await supabase
          .from('posts')
          .update({ status: nextStatus })
          .eq('id', postId);

        if (error) {
          throw error;
        }
      } else if (!usingPreviewData) {
        throw new Error('Preview record');
      }

      setPosts((prev) => {
        const next = prev.map((item) =>
          item.id === postId ? { ...item, status: nextStatus } : item
        );
        if (usingPreviewData) saveLocalPreviewPosts(next);
        return next;
      });
      showToast(
        nextStatus === 'resolved' ? 'อัปเดตสถานะเป็นได้คนช่วยแล้ว' : 'เปิดเคสใหม่อีกครั้งแล้ว',
        'success'
      );
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (usingPreviewData || code === '42501') {
        setPosts((prev) => {
          const next = prev.map((item) =>
            item.id === postId ? { ...item, status: nextStatus } : item
          );
          saveLocalPreviewPosts(next);
          return next;
        });
        showToast(
          nextStatus === 'resolved' ? 'อัปเดตสถานะเป็นได้คนช่วยแล้ว' : 'เปิดเคสใหม่อีกครั้งแล้ว',
          'success'
        );
        return true;
      }
      showToast('ไม่สามารถอัปเดตสถานะเคสได้ กรุณาลองใหม่อีกครั้ง', 'error');
      return false;
    }
  };

  const handleAddComment = async (payload: CreateCommentPayload): Promise<boolean> => {
    try {
      if (!payload.post_id.startsWith('seed-') && !payload.post_id.startsWith('local-')) {
        const { data, error } = await supabase
          .from('comments')
          .insert([payload])
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        const createdComment = data as Comment;
        setPosts((prev) =>
          prev.map((item) =>
            item.id === payload.post_id
              ? { ...item, comments: [...(item.comments ?? []), createdComment] }
              : item
          )
        );
        showToast(
          payload.is_volunteer ? 'ขอบคุณที่อาสาช่วยติว! ส่งคำตอบเรียบร้อยแล้ว' : 'ส่งคำตอบเรียบร้อยแล้ว!',
          'success'
        );
        return true;
      }

      throw { code: '42501' };
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (usingPreviewData || code === '42501') {
        const localComment: Comment = {
          id: `local-c-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...payload,
        };
        setPosts((prev) => {
          const next = prev.map((item) =>
            item.id === payload.post_id
              ? { ...item, comments: [...(item.comments ?? []), localComment] }
              : item
          );
          saveLocalPreviewPosts(next);
          return next;
        });
        showToast(
          payload.is_volunteer ? 'ขอบคุณที่อาสาช่วยติว! ส่งคำตอบเรียบร้อยแล้ว' : 'ส่งคำตอบเรียบร้อยแล้ว!',
          'success'
        );
        return true;
      }

      showToast('ไม่สามารถส่งคำตอบได้ กรุณาลองใหม่อีกครั้ง', 'error');
      return false;
    }
  };

  const hasActiveFilters =
    filters.search.trim() !== '' || filters.subject !== 'ทั้งหมด' || filters.status !== 'all';

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Navbar onCreateClick={() => setIsCreateOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-14">
        <StatsOverview
          total={stats.total}
          open={stats.open}
          resolved={stats.resolved}
          loading={loading}
        />

        {fetchError && (
          <div
            role="status"
            className="mb-5 px-4 py-3 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900"
          >
            <p className="leading-relaxed">{fetchError}</p>
            <button
              type="button"
              onClick={() => void fetchPosts()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-300 rounded-lg text-xs font-medium text-amber-900 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>ลองเชื่อมต่อใหม่</span>
            </button>
          </div>
        )}

        <FilterBar filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl py-14 px-6 text-center max-w-lg mx-auto my-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 mt-4">
              {hasActiveFilters ? 'ไม่พบโพสต์ที่ตรงกับตัวกรอง' : 'ยังไม่มีคำขอความช่วยเหลือในขณะนี้'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {hasActiveFilters
                ? 'ลองเปลี่ยนคำค้นหา เลือกรายวิชาอื่น หรือล้างตัวกรองเพื่อดูโพสต์ทั้งหมด'
                : 'เริ่มต้นโพสต์คำถามหรือหัวข้อที่อยากให้เพื่อนและรุ่นพี่ช่วยติวได้เลย'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>ล้างตัวกรองทั้งหมด</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
              >
                <span>+ โพสต์ขอความช่วยเหลือ</span>
              </button>
            )}
          </div>
        ) : (
          <div
            data-testid="posts-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onSelect={(p) => setSelectedPostId(p.id)} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>MAW (MWIT-anywhere) — พื้นที่แบ่งปันความรู้เพื่อชาวมหิดลวิทยานุสรณ์</span>
          <span>ถามได้ทุกเรื่อง ช่วยกันติวได้ทุกที่</span>
        </div>
      </footer>

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePost}
      />

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPostId(null)}
        onToggleStatus={handleToggleStatus}
        onAddComment={handleAddComment}
        onNotify={showToast}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
