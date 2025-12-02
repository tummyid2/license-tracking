# 📋 License Tracking System

> ระบบติดตามและแจ้งเตือนใบอนุญาตหมดอายุอัตโนมัติผ่าน LINE Messaging API

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📑 สารบัญ

- [ภาพรวมระบบ](#-ภาพรวมระบบ)
- [คุณสมบัติหลัก](#-คุณสมบัติหลัก)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ)
- [ข้อกำหนดระบบ](#-ข้อกำหนดระบบ)
- [การติดตั้ง](#-การติดตั้ง)
- [การตั้งค่า](#-การตั้งค่า)
- [การใช้งาน](#-การใช้งาน)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 ภาพรวมระบบ

**License Tracking System** เป็นระบบจัดการและติดตามใบอนุญาต (License/Registration) ที่ช่วยให้องค์กรสามารถ:

- 📊 **ติดตาม** วันหมดอายุของใบอนุญาตทุกประเภท
- 🔔 **แจ้งเตือนอัตโนมัติ** ผ่าน LINE เมื่อใกล้หมดอายุ
- 🎯 **จัดการ** ข้อมูลบริษัท หมวดหมู่ และขอบเขตการอนุญาต
- 📈 **วิเคราะห์** สถานะและสถิติใบอนุญาต
- ⚡ **ประหยัดเวลา** ด้วยระบบแจ้งเตือนที่ชาญฉลาด

### 🌟 จุดเด่น

✅ แจ้งเตือน **4 ระดับ** ตามความเร่งด่วน (90, 45, 30, 15 วัน)  
✅ **ป้องกันการส่งซ้ำ** ภายใน 15 วัน  
✅ **จัดการโควต้า** 300 ข้อความ/เดือนอัจฉริยะ  
✅ **Dark Mode** รองรับทั้ง Light และ Dark Theme  
✅ **Responsive Design** ใช้งานได้ทุกอุปกรณ์  
✅ **Real-time Updates** อัปเดตข้อมูลแบบ real-time

---

## ⭐ คุณสมบัติหลัก

### 1. 📱 Dashboard แบบ Interactive

- แสดงภาพรวมสถานะใบอนุญาตแบบ real-time
- กรองและจัดกลุ่มตามบริษัท, หมวดหมู่, หรือสถานะ
- กราฟและสถิติแบบ visual
- รองรับ Dark/Light Mode

### 2. 🔔 ระบบแจ้งเตือนอัจฉริยะ

- **4 ระดับความเร่งด่วน:**
  - 🔵 **90 วัน** - แจ้งเตือนล่วงหน้า (รวมหลายใบ)
  - 🟡 **45 วัน** - เตรียมการต่ออายุ (รวมหลายใบ)
  - 🟠 **30 วัน** - ควรดำเนินการ (รวมหลายใบ)
  - 🔴 **15 วัน** - ด่วนมาก! (แจ้งแยกทุกใบ)

- **Deduplication**: ไม่ส่งซ้ำภายใน 15 วัน
- **Quota Management**: จัดการ 300 ข้อความ/เดือนอัตโนมัติ
- **Smart Batching**: รวมข้อความเพื่อประหยัดโควต้า

### 3. ⚙️ การจัดการข้อมูล

- CRUD ใบอนุญาตแบบเต็มรูปแบบ
- จัดการข้อมูลบริษัท, หมวดหมู่, ขอบเขต
- นำเข้า/ส่งออกข้อมูล
- ประวัติการแจ้งเตือน

### 4. 🤖 Automation

- **Manual Notification** - ส่งทันทีเมื่อคลิกปุ่ม
- **Cron Job** - ตรวจสอบและส่งอัตโนมัติทุกวัน
- **Vercel Cron Integration** - ไม่ต้องจัดการ server เอง

### 5. 🔐 Security & Authentication

- Supabase Authentication
- Row Level Security (RLS)
- Protected API Routes
- Secure Cron Endpoints

---

## 🛠️ เทคโนโลยีที่ใช้

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| ⚛️ **Next.js** | 15.1 | React Framework with App Router |
| ⚛️ **React** | 19.2 | UI Library |
| 📘 **TypeScript** | 5.8 | Type Safety |
| 🎨 **Tailwind CSS** | 3.4 | Utility-first CSS |
| 🎭 **Radix UI** | Latest | Headless UI Components |
| 🎨 **shadcn/ui** | Latest | Pre-built Components |
| 🌓 **next-themes** | 0.4.6 | Dark Mode Support |
| 📝 **React Hook Form** | 7.67 | Form Management |
| ✅ **Zod** | 4.1 | Schema Validation |
| 📅 **date-fns** | 4.1 | Date Utilities |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| 🗄️ **Supabase** | 2.86 | Backend as a Service |
| 🐘 **PostgreSQL** | Latest | Relational Database |
| 🔑 **Supabase Auth** | Latest | Authentication |
| 🔒 **Row Level Security** | - | Data Security |
| 🕒 **Vercel Cron** | - | Scheduled Jobs |

### External Services

| Service | Purpose |
|---------|---------|
| 📱 **LINE Messaging API** | Push Notifications |
| 🚀 **Vercel** | Hosting & Deployment |
| 📊 **Supabase** | Database & Auth |

### Development Tools

| Tool | Purpose |
|------|---------|
| 🔧 **ESLint** | Code Linting |
| 🎨 **Prettier** | Code Formatting |
| 📦 **npm** | Package Management |
| 🔥 **Git** | Version Control |

---

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  (Next.js App Router + React + Tailwind + shadcn/ui)   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   API Routes                             │
│  • /api/licenses    - License CRUD                       │
│  • /api/notify/line - Manual Notifications               │
│  • /api/cron/check-expiry - Auto Notifications           │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Supabase   │ │ LINE        │ │  Vercel     │
│  PostgreSQL │ │ Messaging   │ │  Cron       │
│             │ │ API         │ │             │
│ • licenses  │ │             │ │ Triggers:   │
│ • companies │ │ Broadcast   │ │ Daily 8 AM  │
│ • tags      │ │ Messages    │ │ UTC         │
│ • scopes    │ │             │ │             │
│ • notif_    │ │             │ │             │
│   logs      │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
```

### 📁 โครงสร้างโฟลเดอร์

```
license-tracking-system/
├── 📁 app/                      # Next.js App Router
│   ├── 📁 api/                  # API Routes
│   │   ├── 📁 licenses/         # License CRUD
│   │   ├── 📁 notify/line/      # Manual Notification
│   │   └── 📁 cron/check-expiry/# Auto Notification
│   ├── 📁 admin/                # Admin Dashboard
│   ├── 📁 login/                # Login Page
│   ├── page.tsx                 # Home/Dashboard
│   └── layout.tsx               # Root Layout
│
├── 📁 components/               # React Components
│   ├── 📁 licenses/             # License Components
│   ├── 📁 common/               # Shared Components
│   └── 📁 ui/                   # shadcn/ui Components
│
├── 📁 lib/                      # Utilities
│   ├── 📁 supabase/             # Supabase Clients
│   └── utils.ts                 # Helpers
│
├── 📁 contexts/                 # React Contexts
│   ├── AuthContext.tsx          # Authentication
│   └── ThemeContext.tsx         # Theme Management
│
├── 📁 migrations/               # Database Migrations
│   ├── 01_normalization.sql     # Initial Schema
│   └── 02_notification_logs.sql # Notification Logs
│
├── 📁 utils/                    # Utility Functions
├── types.ts                     # TypeScript Types
├── vercel.json                  # Vercel Config (Cron)
└── package.json                 # Dependencies
```

---

## 💻 ข้อกำหนดระบบ

### Software Requirements

- **Node.js** >= 18.x
- **npm** >= 9.x หรือ **yarn** >= 1.22
- **Git** (สำหรับ version control)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Recommended IDE

- **VS Code** พร้อม extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Services Required

1. **Supabase Account** (ฟรี)
2. **LINE Developers Account** (ฟรี)
3. **Vercel Account** (ฟรี - สำหรับ deployment)

---

## 🚀 การติดตั้ง

### ขั้นตอนที่ 1: Clone Repository

```bash
git clone https://github.com/yourusername/license-tracking-system.git
cd license-tracking-system
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies

```bash
npm install
```

หรือใช้ yarn:

```bash
yarn install
```

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` (คัดลอกจาก `.env.example`):

```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token

# Cron Job Security
CRON_SECRET=your-random-secret-key-here
```

### ขั้นตอนที่ 4: ตั้งค่า Supabase

#### 4.1 สร้าง Supabase Project

1. ไปที่ [Supabase](https://supabase.com/)
2. คลิก **New Project**
3. กรอกข้อมูล:
   - **Name**: license-tracking-system
   - **Database Password**: สร้าง strong password
   - **Region**: เลือกใกล้ที่สุด (e.g., Southeast Asia)
4. คลิก **Create new project**

#### 4.2 รัน Database Migrations

1. เปิด **SQL Editor** ใน Supabase Dashboard
2. รัน migration ตามลำดับ:

**Migration 1:** `database-setup.sql`
```sql
-- คัดลอกโค้ดจากไฟล์ database-setup.sql แล้ว Run
```

**Migration 2:** `migrations/02_notification_logs.sql`
```sql
-- คัดลอกโค้ดจากไฟล์ migrations/02_notification_logs.sql แล้ว Run
```

#### 4.3 คัดลอก API Keys

1. ไปที่ **Settings** → **API**
2. คัดลอก:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ เก็บลับ!

### ขั้นตอนที่ 5: ตั้งค่า LINE Official Account

#### 5.1 สร้าง LINE Messaging API Channel

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. Login ด้วยบัญชี LINE
3. สร้าง **Provider** (ถ้ายังไม่มี)
4. คลิก **Create a Messaging API channel**
5. กรอกข้อมูล:
   - **Channel name**: License Tracker Bot
   - **Channel description**: ระบบแจ้งเตือนใบอนุญาตหมดอายุ
   - **Category**: เลือกตามความเหมาะสม
6. Agree to terms → **Create**

#### 5.2 รับ Channel Access Token

1. เข้า Channel ที่สร้าง
2. ไปที่แท็บ **Messaging API**
3. ในส่วน **Channel access token**:
   - คลิก **Issue** (ถ้ายังไม่มี)
   - **Copy** token → `LINE_CHANNEL_ACCESS_TOKEN`

#### 5.3 เพิ่มเพื่อน Official Account

1. ในหน้า **Messaging API** จะมี **QR Code**
2. **สแกน QR Code** ด้วยแอป LINE
3. **Add เป็นเพื่อน**
4. ทุกคนที่จะรับการแจ้งเตือนต้อง Add เพื่อนกับ Bot นี้

### ขั้นตอนที่ 6: สร้าง Cron Secret

```bash
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Linux/Mac
openssl rand -hex 32
```

คัดลอกผลลัพธ์ใส่ใน `CRON_SECRET`

### ขั้นตอนที่ 7: รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000) 🎉

---

## ⚙️ การตั้งค่า

### การตั้งค่า Authentication (Optional)

ถ้าต้องการระบบ Login:

1. เปิด Supabase Dashboard
2. ไปที่ **Authentication** → **Providers**
3. เปิดใช้งาน **Email** provider
4. (Optional) ตั้งค่า **Google**, **GitHub** OAuth

### การตั้งค่า Row Level Security (RLS)

ตรวจสอบ RLS policies ใน Supabase:

```sql
-- ดู policies ที่มีอยู่
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ตัวอย่าง policy สำหรับ licenses table
CREATE POLICY "Allow all for authenticated users"
ON licenses FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

## 📖 การใช้งาน

### 🏠 หน้า Dashboard

#### ภาพรวมสถานะ

Dashboard แสดง 4 การ์ดหลัก:

1. **📊 ใบอนุญาตทั้งหมด** - จำนวนรวม
2. **🔴 หมดอายุแล้ว** - ต้องดำเนินการด่วน
3. **🟠 ใกล้หมดอายุ** - เหลือ ≤90 วัน
4. **🟢 ใช้งานปกติ** - ยังไม่ต้องดำเนินการ

#### การกรองข้อมูล

- คลิกที่การ์ดเพื่อกรองตามสถานะ
- ใช้ปุ่ม **Group By** เพื่อจัดกลุ่มตาม:
  - **None** - แสดงทั้งหมด
  - **Company** - จัดกลุ่มตามบริษัท
  - **Tag** - จัดกลุ่มตามหมวดหมู่

### 🔔 การส่งการแจ้งเตือน

#### วิธีที่ 1: Manual (ส่งทันที)

1. ไปที่หน้า Dashboard
2. คลิกปุ่ม **🔔 Notify LINE** (สีเขียว)
3. ระบบจะ:
   - กรองใบอนุญาตที่ต้องแจ้งเตือน (1-90 วัน)
   - ตรวจสอบว่าเคยแจ้งเตือนไปแล้วหรือยัง
   - ส่งการแจ้งเตือนไปยัง LINE
   - แสดงผลลัพธ์และโควต้าคงเหลือ

#### วิธีที่ 2: Automatic (Cron Job)

ระบบจะตรวจสอบและส่งอัตโนมัติทุกวัน:

- **Development**: ทดสอบด้วย `curl`:
  ```bash
  curl -X GET http://localhost:3000/api/cron/check-expiry \
    -H "Authorization: Bearer your-cron-secret"
  ```

- **Production**: Vercel Cron ทำงานอัตโนมัติตาม `vercel.json`
  ```json
  "schedule": "0 8 * * *"  // ทุกวัน 08:00 UTC (15:00 ICT)
  ```

### 📝 การจัดการใบอนุญาต

#### เพิ่มใบอนุญาตใหม่

1. ไปที่ **Admin Panel** (ปุ่ม Settings/Admin)
2. คลิก **➕ Add License**
3. กรอกข้อมูล:
   - เลขทะเบียน (Registration No)
   - บริษัท
   - หมวดหมู่ (Tag)
   - ขอบเขต (Scope)
   - วันที่มีผลและวันหมดอายุ
4. คลิก **Save**

#### แก้ไขใบอนุญาต

1. คลิกที่รายการใบอนุญาตในตาราง
2. แก้ไขข้อมูล
3. คลิก **Update**

#### ลบใบอนุญาต

1. คลิกปุ่ม ⋮ (เมนู) ที่รายการ
2. เลือก **Delete**
3. ยืนยันการลบ

### 📊 การดูประวัติการแจ้งเตือน

เข้า Supabase Dashboard → Table Editor → `notification_logs`:

```sql
-- ดูประวัติล่าสุด 20 รายการ
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
```

### 🎨 Theme (Dark/Light Mode)

- คลิกปุ่ม 🌙/☀️ ที่ Navbar
- ระบบจะจำ preference ไว้อัตโนมัติ

---

## 📡 API Documentation

### GET `/api/licenses`

ดึงข้อมูลใบอนุญาตทั้งหมด

**Response:**
```json
[
  {
    "id": "uuid",
    "registrationNo": "SG-20-013",
    "company": "บริษัท ABC จำกัด",
    "tag": "SG",
    "validUntil": "2025-12-31",
    "daysRemaining": 45,
    "computedStatus": "Expiring Soon"
  }
]
```

### POST `/api/notify/line`

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
  "messagesSent": 2,
  "quotaRemaining": 295,
  "quotaWarning": false
}
```

### GET `/api/cron/check-expiry`

Cron job endpoint (ต้องมี Authorization header)

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
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

## 🗄️ Database Schema

### Tables

#### `licenses`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| registration_no | TEXT | เลขทะเบียน (Unique) |
| company_id | UUID | FK → companies |
| tag_id | UUID | FK → tags |
| scope_id | UUID | FK → scopes |
| valid_until | DATE | วันหมดอายุ |
| effective_date | DATE | วันที่มีผล |
| status | TEXT | สถานะ |
| remark | TEXT | หมายเหตุ |

#### `companies`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | TEXT | ชื่อบริษัท (Unique) |
| address | TEXT | ที่อยู่ |
| contact_person | TEXT | ผู้ติดต่อ |
| email | TEXT | อีเมล |
| phone | TEXT | เบอร์โทร |

#### `notification_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| license_id | UUID | FK → licenses |
| notification_type | TEXT | 90_days, 45_days, 30_days, 15_days, manual |
| sent_at | TIMESTAMP | เวลาที่ส่ง |
| status | TEXT | success, failed, pending |
| message_preview | TEXT | ตัวอย่างข้อความ |
| error_message | TEXT | ข้อความ error (ถ้ามี) |

---

## 🚀 Deployment

### Deploy to Vercel

#### วิธีที่ 1: GitHub Integration (แนะนำ)

1. **Push code ขึ้น GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/license-tracking-system.git
   git push -u origin main
   ```

2. **Import ใน Vercel:**
   - ไปที่ [vercel.com/new](https://vercel.com/new)
   - เลือก Repository
   - คลิก **Import**

3. **ตั้งค่า Environment Variables:**
   - ใส่ค่าเหมือนใน `.env.local`
   - คลิก **Deploy**

4. **ตรวจสอบ Cron Job:**
   - ไปที่ Dashboard → Cron Jobs
   - ตรวจสอบ `/api/cron/check-expiry` ทำงาน

#### วิธีที่ 2: Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# ตั้งค่า env vars
vercel env add LINE_CHANNEL_ACCESS_TOKEN
vercel env add CRON_SECRET
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Production Checklist

- [ ] Environment variables ครบทุกตัว
- [ ] Database migrations รันเรียบร้อย
- [ ] LINE Official Account พร้อมใช้งาน
- [ ] ทดสอบ Cron Job ด้วย curl
- [ ] ตรวจสอบ Vercel Cron ทำงาน
- [ ] แชร์ QR Code ให้ทีมงาน Add เพื่อน

---

## 🔧 Troubleshooting

### ❌ ไม่ได้รับการแจ้งเตือนใน LINE

**สาเหตุที่เป็นไปได้:**

1. ❌ **ยังไม่ได้ Add เพื่อนกับ Bot**
   - ✅ สแกน QR Code และ Add เพื่อน

2. ❌ **LINE_CHANNEL_ACCESS_TOKEN ผิด**
   - ✅ ตรวจสอบ token ใน `.env.local`
   - ✅ Re-issue token ใหม่ถ้าหมดอายุ

3. ❌ **ส่งซ้ำภายใน 15 วัน**
   - ✅ ตรวจสอบ `notification_logs` table
   - ✅ รอ 15 วันหรือลบ log เพื่อทดสอบ

### ❌ Cron Job ไม่ทำงาน

1. ❌ **CRON_SECRET ไม่ตรงกัน**
   - ✅ ตรวจสอบค่าใน Vercel env vars

2. ❌ **vercel.json ไม่ deploy**
   - ✅ Commit และ push ไฟล์นี้
   - ✅ Redeploy

3. ❌ **Function timeout**
   - ✅ Upgrade Vercel plan (Hobby = 10s, Pro = 60s)

### ❌ Database Connection Error

1. ❌ **SUPABASE_SERVICE_ROLE_KEY ไม่มี**
   - ✅ เพิ่มใน `.env.local`
   - ✅ Restart dev server

2. ❌ **RLS Policy block**
   - ✅ ใช้ `getServiceSupabase()` สำหรับ cron
   - ✅ ตรวจสอบ policies

### ❌ Build Error

```bash
# Clear cache และ rebuild
rm -rf .next
npm install
npm run build
```

### 📋 Logs

**Development:**
```bash
# ดู console logs
npm run dev
```

**Production (Vercel):**
1. Dashboard → Deployments
2. เลือก deployment
3. คลิก **Functions**
4. เลือก function → **Logs**

---

## 📚 เอกสารเพิ่มเติม

- 📖 [LINE Notification Setup Guide](./LINE_NOTIFICATION_SETUP.md)
- 📖 [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)
- 📖 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Created with ❤️ by Your Team

- 🌐 Website: [your-website.com](https://your-website.com)
- 📧 Email: your-email@example.com
- 💼 LinkedIn: [Your Name](https://linkedin.com/in/yourname)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [LINE Developers](https://developers.line.biz/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**⭐ ถ้าโปรเจคนี้มีประโยชน์ อย่าลืมกด Star! ⭐**

Made with 💚 in Thailand 🇹🇭

</div>
