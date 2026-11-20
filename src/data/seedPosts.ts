import type { Post } from '../types';

const now = Date.now();
const minsAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

export const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    created_at: minsAgo(18),
    title: 'ขอคนช่วยอธิบายเรื่องสมดุลเคมี (Le Chatelier) กับค่า Kp/Kc ครับ',
    description:
      'ติดตรงโจทย์ข้อที่เปลี่ยนปริมาตรภาชนะแล้วเติมแก๊สเฉื่อยลงไปครับ ไม่แน่ใจว่ากรณีความดันคงที่กับปริมาตรคงที่ดูต่างกันยังไง พรุ่งนี้มีควิซคาบเช้าครับ',
    subject: 'เคมี',
    urgency: 'ด่วนมาก',
    location_type: 'หอพัก',
    author_name: 'ต้นกล้า',
    author_role: 'นักเรียน ม.4',
    contact_info: 'Line ID: @tonkla_mwit34',
    status: 'open',
    comments: [
      {
        id: 'seed-c1',
        created_at: minsAgo(9),
        post_id: 'seed-1',
        responder_name: 'พี่ภูมิ (ม.6/2)',
        responder_role: 'รุ่นพี่',
        message:
          'จำง่ายๆ ว่าแก๊สเฉื่อยจะเปลี่ยนสมดุลก็ต่อเมื่อความดันรวมคงที่ (ปริมาตรขยาย ทำให้ความเข้มข้นลด) เดี๋ยวแวะไปติวที่ห้อง Common หอชายตอน 2 ทุ่มได้นะ ทักไลน์มาเลย',
        is_volunteer: true,
      },
    ],
  },
  {
    id: 'seed-2',
    created_at: minsAgo(45),
    title: 'หาเพื่อนหรือรุ่นพี่ช่วยเช็กแนวคิดโจทย์คอมบินาทอริก (Stars and Bars)',
    description:
      'ทำแบบฝึกหัดท้ายบทเรื่องการแบ่งของเหมือนกันลงกล่องต่างกันแบบมีเงื่อนไขขั้นต่ำ แล้วคำตอบไม่ตรงเฉลยครับ อยากให้ช่วยดูวิธีคิดหน่อย',
    subject: 'คณิตศาสตร์',
    urgency: 'เตรียมสอบ',
    location_type: 'ห้องสมุด / อาคารเรียน',
    author_name: 'มินนี่',
    author_role: 'นักเรียน ม.4',
    contact_info: 'IG: minnie.k_mwit',
    status: 'open',
    comments: [
      {
        id: 'seed-c2',
        created_at: minsAgo(25),
        post_id: 'seed-2',
        responder_name: 'อาร์ม',
        responder_role: 'เพื่อนร่วมรุ่น',
        message: 'ลองเช็กดูว่าโจทย์ให้มีกล่องว่างได้ไหม ถ้าห้ามว่างต้องแจกให้ก่อนอย่างน้อย 1 ชิ้นครับ',
        is_volunteer: false,
      },
    ],
  },
  {
    id: 'seed-3',
    created_at: hoursAgo(2),
    title: 'อยากให้ช่วยทวนเรื่อง Dynamic Programming (Knapsack & LIS) เตรียมค่าย สอวน.',
    description:
      'เข้าใจแนวคิด Recursion แล้ว แต่พอแปลงเป็น Bottom-up DP ยังกำหนด state กับ base case สับสนอยู่ครับ สะดวกคุยผ่าน Discord แชร์หน้าจอเขียนโค้ดกันครับ',
    subject: 'คอมพิวเตอร์',
    urgency: 'เตรียมสอบ',
    location_type: 'ออนไลน์ (Discord / Meet)',
    author_name: 'เจเจ',
    author_role: 'นักเรียน ม.5',
    contact_info: 'Discord: jj_code#4092',
    status: 'open',
    comments: [
      {
        id: 'seed-c3',
        created_at: hoursAgo(1),
        post_id: 'seed-3',
        responder_name: 'พี่ณัฐ (ค่าย 2)',
        responder_role: 'รุ่นพี่',
        message: 'ว่างช่วง 20:30 น. ครับ เดี๋ยวแอด Discord ไปไล่ทีละสเต็ปให้เลย',
        is_volunteer: true,
      },
    ],
  },
  {
    id: 'seed-4',
    created_at: hoursAgo(4),
    title: 'ขอคำแนะนำการเขียน Abstract โครงงานวิทยาศาสตร์ภาษาอังกฤษครับ',
    description:
      'กำลังจะส่งบทคัดย่อเข้าประกวดโครงงาน แต่ยังไม่มั่นใจการใช้ Tense และคำเชื่อมทางวิชาการให้กระชับตามมาตรฐานวารสารครับ',
    subject: 'ภาษาอังกฤษ',
    urgency: 'การบ้าน/ทั่วไป',
    location_type: 'ได้ทั้งออนไลน์และเจอตัว',
    author_name: 'พลอยใส',
    author_role: 'นักเรียน ม.5',
    contact_info: 'Line ID: ploysai.sr',
    status: 'open',
    comments: [],
  },
  {
    id: 'seed-5',
    created_at: hoursAgo(7),
    title: 'ช่วยดูวิธีคำนวณโมเมนต์ความเฉื่อยและการกลิ้งโดยไม่ไถล (Rolling Motion)',
    description:
      'งงตอนตั้งสมการแรงเสียดทานสถิตกับความเร่งเชิงมุมบนพื้นเอียงครับ ว่าทิศทางของ f ชี้ขึ้นหรือลงในแต่ละกรณี',
    subject: 'ฟิสิกส์',
    urgency: 'ด่วนมาก',
    location_type: 'ห้องสมุด / อาคารเรียน',
    author_name: 'กันต์',
    author_role: 'นักเรียน ม.5',
    contact_info: 'Line ID: gun_phy',
    status: 'resolved',
    comments: [
      {
        id: 'seed-c4',
        created_at: hoursAgo(6),
        post_id: 'seed-5',
        responder_name: 'อ.วิชัย (หมวดฟิสิกส์)',
        responder_role: 'อาจารย์',
        message:
          'แวะมาคุยที่ห้องพักครูฟิสิกส์ช่วงบ่าย 3 ได้เลยครับ หรือดูหลักการว่าแรงเสียดทานสถิตต้านแนวโน้มการไถลของจุดสัมผัส',
        is_volunteer: true,
      },
      {
        id: 'seed-c5',
        created_at: hoursAgo(5),
        post_id: 'seed-5',
        responder_name: 'กันต์',
        responder_role: 'เพื่อนร่วมรุ่น',
        message: 'เข้าไปถามอาจารย์เรียบร้อยแล้วครับ เข้าใจกระจ่างเลย ขอบคุณมากๆ ครับ!',
        is_volunteer: false,
      },
    ],
  },
  {
    id: 'seed-6',
    created_at: hoursAgo(14),
    title: 'สรุปกลไก Photosynthesis (Light Reaction vs Calvin Cycle) แบบเชื่อมโยง',
    description:
      'จำชื่อเอนไซม์และลำดับตัวรับอิเล็กตรอนใน Photosystem II กับ I สลับกันบ่อยมาก อยากได้คนช่วยเล่าเป็นภาพรวมก่อนสอบปลายภาคครับ',
    subject: 'ชีววิทยา',
    urgency: 'การบ้าน/ทั่วไป',
    location_type: 'ออนไลน์ (Discord / Meet)',
    author_name: 'น้ำหวาน',
    author_role: 'นักเรียน ม.4',
    contact_info: 'IG: namwan.bio',
    status: 'resolved',
    comments: [
      {
        id: 'seed-c6',
        created_at: hoursAgo(12),
        post_id: 'seed-6',
        responder_name: 'พี่แพรว (ม.6)',
        responder_role: 'รุ่นพี่',
        message: 'พี่ส่งโน้ตสรุป Z-scheme พร้อมติวสั้นๆ ให้ทาง IG แล้วนะคะ',
        is_volunteer: true,
      },
    ],
  },
];
