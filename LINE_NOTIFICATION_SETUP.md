# LINE Notification System Setup Guide

## ภาพรวม

ระบบนี้ส่งการแจ้งเตือนอัตโนมัติผ่าน LINE Messaging API เมื่อใบอนุญาตใกล้หมดอายุ

### คุณสมบัติ
- ✅ แจ้งเตือน 3 ระดับ: 45, 30, 15 วันก่อนหมดอายุ
- ✅ ป้องกันการส่งซ้ำภายใน 15 วัน
- ✅ จัดการโควต้า 300 ข้อความ/เดือน
- ✅ บันทึกประวัติการแจ้งเตือน
- ✅ ส่งด้วยตนเอง (Manual) หรืออัตโนมัติ (Cron)

---

## การตั้งค่าเบื้องต้น

### 1. สร้าง LINE Official Account

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. Login ด้วยบัญชี LINE Business
3. สร้าง **Provider** (ถ้ายังไม่มี)
4. สร้าง **Messaging API Channel** ใหม่
5. กรอกข้อมูล:
   - Channel name: `License Tracker Bot`
   - Channel description: `ระบบแจ้งเตือนใบอนุญาตหมดอายุ`
   - Category: เลือกตามความเหมาะสม

### 2. รับ Channel Access Token

1. เข้า Channel ที่สร้างไว้
2. ไปที่แท็บ **Messaging API**
3. กด **Issue** ใต้ "Channel access token"
4. คัดลอก Token (เก็บไว้ใช้ในขั้นตอนถัดไป)

### 3. เพิ่มเพื่อน Official Account

1. ในหน้า Messaging API จะมี QR Code
2. สแกน QR Code ด้วยแอป LINE บนมือถือ
3. Add เป็นเพื่อน
4. **สำคัญ:** ทุกคนที่จะรับการแจ้งเตือนต้อง Add เพื่อนกับ Bot นี้

---

## การติดตั้งและตั้งค่า

### ขั้นตอนที่ 1: รัน Migration

เข้า Supabase SQL Editor และรันไฟล์:

```bash
# รัน migration สร้างตาราง notification_logs
# ไฟล์: migrations/02_notification_logs.sql
```

หรือคัดลอก SQL จากไฟล์ไปรันใน Supabase SQL Editor

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables

1. สร้างไฟล์ `.env.local` (ถ้ายังไม่มี)
2. เพิ่มค่าต่อไปนี้:

```env
# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here

# Cron Security (สร้าง random string)
CRON_SECRET=my-secret-key-12345
```

**วิธีสร้าง CRON_SECRET:**
```bash
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Linux/Mac
openssl rand -hex 32
```

### ขั้นตอนที่ 3: ทดสอบระบบ

1. รันโปรเจค:
```bash
npm run dev
```

2. เปิดเบราว์เซอร์: `http://localhost:3000`
3. คลิกปุ่ม **"Notify LINE"**
4. ตรวจสอบ LINE ว่าได้รับข้อความ

---

## การใช้งาน

### แจ้งเตือนด้วยตนเอง (Manual)

1. เข้าหน้าหลัก
2. คลิกปุ่ม **"Notify LINE"** สีเขียว
3. ระบบจะส่งการแจ้งเตือนทันที
4. แสดงผลว่าส่งกี่รายการ และโควต้าคงเหลือ

### แจ้งเตือนอัตโนมัติ (Cron)

**ตัวเลือก 1: Vercel Cron (แนะนำ)**

1. สร้างไฟล์ `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/check-expiry",
    "schedule": "0 9 * * *"
  }]
}
```

**ปรับเวลาการทำงาน (Optional):**

ถ้าต้องการเปลี่ยนเวลา แก้ `schedule` ใน `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/check-expiry",
    "schedule": "0 2 * * *" // ← 02:00 UTC (09:00 ICT)
  }]
}
```

**รูปแบบ Cron Expression:**

```
┌───────────── นาที (0-59)
│ ┌───────────── ชั่วโมง (0-23)
│ │ ┌───────────── วันที่ (1-31)
│ │ │ ┌───────────── เดือน (1-12)
│ │ │ │ ┌───────────── วันในสัปดาห์ (0-7, 0=อาทิตย์)
│ │ │ │ │
* * * * *
```

**ตัวอย่าง:**
- `0 2 * * *` - ทุกวันเวลา 02:00 UTC (09:00 ICT)
- `0 0 * * *` - ทุกวันเวลา 00:00 UTC (07:00 ICT)
- `0 */6 * * *` - ทุกๆ 6 ชั่วโมง
- `0 9 * * 1` - ทุกวันจันทร์ เวลา 09:00 UTC

**ตรวจสอบ Quota (Vercel):**
- **Hobby Plan**: ฟรี, unlimited cron jobs, ทำงาน max 10 วินาที
- **Pro Plan**: $20/เดือน, max 60 วินาที

> Cron job ของคุณควรทำงานเสร็จภายใน 10 วินาที (Hobby) ซึ่งเพียงพอแล้ว

2. Deploy ไปที่ Vercel
3. ระบบจะทำงานทุกวันเวลา 9:00 น. (UTC)

**ตัวเลือก 2: ทดสอบด้วย curl**

```bash
curl -X GET https://your-domain.com/api/cron/check-expiry \
  -H "Authorization: Bearer your-cron-secret"
```

---

## โควต้าข้อความ (300 ข้อความ/เดือน)

### การคำนวณ

- **45 วัน**: รวมหลายใบใน 1 ข้อความ → ~1-2 ข้อความ
- **30 วัน**: รวม 5-10 ใบ/ข้อความ → ~5-10 ข้อความ
- **15 วัน**: แยกทุกใบ (เพราะด่วน) → ~50-100 ข้อความ

**รวม:** ประมาณ 100-120 ข้อความ/เดือน สำหรับ 100 ใบอนุญาต

### เมื่อใกล้เกินโควต้า

- ระบบจะเตือนเมื่อใช้ไป 80% (240 ข้อความ)
- ถ้าเต็ม 300 จะไม่ส่งเพิ่ม แต่จะ log error
- โควต้ารีเซ็ตทุกวันที่ 1 ของเดือน

---

## การตรวจสอบประวัติ

เข้า Supabase แล้วรัน query:

```sql
-- ดูประวัติการแจ้งเตือนล่าสุด
SELECT 
  nl.sent_at,
  nl.notification_type,
  nl.status,
  l.registration_no,
  c.name as company
FROM notification_logs nl
JOIN licenses l ON nl.license_id = l.id
LEFT JOIN companies c ON l.company_id = c.id
ORDER BY nl.sent_at DESC
LIMIT 20;

-- นับจำนวนข้อความที่ส่งเดือนนี้
SELECT 
  COUNT(*) as total_sent,
  300 - COUNT(*) as remaining
FROM notification_logs
WHERE sent_at >= date_trunc('month', NOW())
  AND status = 'success';
```

---

## Troubleshooting

### ไม่ได้รับข้อความ LINE

1. ✅ ตรวจสอบว่า Add เพื่อนกับ Bot แล้ว
2. ✅ ตรวจสอบ `LINE_CHANNEL_ACCESS_TOKEN` ถูกต้อง
3. ✅ ดู Network tab ว่า API return 200
4. ✅ ตรวจสอบ `notification_logs` ว่ามี error_message

### เกินโควต้า

1. รอถึงต้นเดือนถัดไป
2. หรือ upgrade LINE Official Account Plan
3. หรือลดความถี่การแจ้งเตือน (เช่น เปลี่ยนจาก 15 วันเป็น 10 วัน)

### Cron ไม่ทำงาน

1. ✅ ตรวจสอบ `CRON_SECRET` ตรงกัน
2. ✅ ดู Vercel Logs
3. ✅ ทดสอบด้วย curl ก่อน

---

## API Documentation

### POST /api/notify/line

ส่งการแจ้งเตือนด้วยตนเอง

**Request:**
```json
{
  "licenses": [...],
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "licensesNotified": 5,
  "messagesSent": 1,
  "quotaRemaining": 285,
  "quotaWarning": false
}
```

### GET /api/cron/check-expiry

ตรวจสอบและส่งการแจ้งเตือนอัตโนมัติ

**Headers:**
```
Authorization: Bearer your-cron-secret
```

**Response:**
```json
{
  "success": true,
  "processed": 10,
  "messagesSent": 3,
  "quotaRemaining": 290
}
```

---

## สรุป

ระบบนี้ช่วยให้คุณไม่พลาดการต่ออายุใบอนุญาต โดย:
- แจ้งเตือนอัตโนมัติ 3 ระดับ
- ป้องกันการส่งซ้ำ
- จัดการโควต้าอย่างชาญฉลาด

หากมีคำถามหรือปัญหา ตรวจสอบ `notification_logs` table หรือดู console logs
