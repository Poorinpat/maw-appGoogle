import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeStats,
  filterAndSortPosts,
  formatRelativeThaiTime,
  getSubjectStyle,
  getUrgencyStyle,
  hasVolunteer,
} from './helpers';
import type { Post } from '../types';

const now = new Date('2026-11-20T12:00:00.000Z');

test('formatRelativeThaiTime formats minutes, hours, days, and moments', () => {
  assert.equal(formatRelativeThaiTime('2026-11-20T11:59:35.000Z', now), 'เมื่อสักครู่');
  assert.equal(formatRelativeThaiTime('2026-11-20T11:45:00.000Z', now), '15 นาทีที่แล้ว');
  assert.equal(formatRelativeThaiTime('2026-11-20T10:00:00.000Z', now), '2 ชั่วโมงที่แล้ว');
  assert.equal(formatRelativeThaiTime('2026-11-17T12:00:00.000Z', now), '3 วันที่แล้ว');
});

const samplePosts: Post[] = [
  {
    id: '1',
    created_at: '2026-11-20T11:00:00.000Z',
    title: 'ช่วยอธิบายสมดุลเคมี Le Chatelier หน่อยครับ',
    description: 'งงเรื่องการเปลี่ยนความดันกับการเติมแก๊สเฉื่อย',
    subject: 'เคมี',
    urgency: 'ด่วนมาก',
    location_type: 'หอพัก',
    author_name: 'ปูน',
    author_role: 'นักเรียน ม.4',
    contact_info: 'Line: @poon_mwit',
    status: 'open',
    comments: [
      {
        id: 'c1',
        created_at: '2026-11-20T11:10:00.000Z',
        post_id: '1',
        responder_name: 'พี่นนท์',
        responder_role: 'รุ่นพี่',
        message: 'เดี๋ยวทักไลน์ไปช่วยติวให้คืนนี้ครับ',
        is_volunteer: true,
      },
    ],
  },
  {
    id: '2',
    created_at: '2026-11-20T11:50:00.000Z',
    title: 'ขอแนวโจทย์การเคลื่อนที่แบบโปรเจกไทล์',
    description: 'เตรียมสอบกลางภาคฟิสิกส์',
    subject: 'ฟิสิกส์',
    urgency: 'เตรียมสอบ',
    location_type: 'ออนไลน์ (Discord / Meet)',
    author_name: 'มิ้นท์',
    author_role: 'นักเรียน ม.4',
    contact_info: 'Discord: mint#2211',
    status: 'resolved',
    comments: [],
  },
  {
    id: '3',
    created_at: '2026-11-20T09:00:00.000Z',
    title: 'ติว Recursion และ DP ก่อนสอบสอวน.',
    description: 'อยากได้คนช่วยไล่โค้ด C++ ข้อ Knapsack',
    subject: 'คอมพิวเตอร์',
    urgency: 'ด่วนมาก',
    location_type: 'ห้องสมุด / อาคารเรียน',
    author_name: 'ก้อง',
    author_role: 'นักเรียน ม.5',
    contact_info: 'IG: kong.dev',
    status: 'open',
    comments: [
      {
        id: 'c2',
        created_at: '2026-11-20T09:30:00.000Z',
        post_id: '3',
        responder_name: 'ภูมิ',
        responder_role: 'เพื่อนร่วมรุ่น',
        message: 'ข้อนี้ลองดูตาราง 1 มิติก่อนนะ',
        is_volunteer: false,
      },
    ],
  },
];

test('computeStats returns total, open, and resolved counts', () => {
  assert.deepEqual(computeStats(samplePosts), {
    total: 3,
    open: 2,
    resolved: 1,
  });
});

test('hasVolunteer detects whether any comment has is_volunteer true', () => {
  assert.equal(hasVolunteer(samplePosts[0]), true);
  assert.equal(hasVolunteer(samplePosts[1]), false);
  assert.equal(hasVolunteer(samplePosts[2]), false);
});

test('filterAndSortPosts filters by search, subject, status and sorts by urgency or newest', () => {
  const urgentOpen = filterAndSortPosts(samplePosts, {
    search: '',
    subject: 'ทั้งหมด',
    status: 'open',
    sort: 'urgent',
  });
  assert.deepEqual(
    urgentOpen.map((p) => p.id),
    ['1', '3']
  );

  const newestAll = filterAndSortPosts(samplePosts, {
    search: '',
    subject: 'ทั้งหมด',
    status: 'all',
    sort: 'newest',
  });
  assert.deepEqual(
    newestAll.map((p) => p.id),
    ['2', '1', '3']
  );

  const searchByAuthor = filterAndSortPosts(samplePosts, {
    search: 'ก้อง',
    subject: 'ทั้งหมด',
    status: 'all',
    sort: 'newest',
  });
  assert.deepEqual(
    searchByAuthor.map((p) => p.id),
    ['3']
  );

  const filterBySubject = filterAndSortPosts(samplePosts, {
    search: '',
    subject: 'ฟิสิกส์',
    status: 'all',
    sort: 'newest',
  });
  assert.deepEqual(
    filterBySubject.map((p) => p.id),
    ['2']
  );
});

test('getSubjectStyle and getUrgencyStyle map known values and fallbacks cleanly', () => {
  assert.ok(getSubjectStyle('ฟิสิกส์').badge.includes('indigo'));
  assert.ok(getSubjectStyle('ไม่มีในรายการ').badge.includes('slate'));
  assert.equal(getUrgencyStyle('ด่วนมาก').priority, 3);
  assert.equal(getUrgencyStyle('เตรียมสอบ').priority, 2);
  assert.equal(getUrgencyStyle('การบ้าน/ทั่วไป').priority, 1);
});
