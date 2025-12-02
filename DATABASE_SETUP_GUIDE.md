# คู่มือการสร้างฐานข้อมูลใหม่

## ⚠️ คำเตือน
Script นี้จะ **ลบข้อมูลเดิมทั้งหมด** และสร้างฐานข้อมูลใหม่!

## ขั้นตอนการทำงาน

### 1. เข้า Supabase Dashboard
1. ไปที่ https://app.supabase.com
2. เลือก Project ของคุณ
3. คลิกที่เมนู **SQL Editor** (ด้านซ้าย)

### 2. รัน SQL Script
1. คลิก **New Query**
2. Copy โค้ดทั้งหมดจากไฟล์ `database-setup.sql`
3. Paste ลงใน SQL Editor
4. คลิก **Run** หรือกด `Ctrl+Enter`

### 3. ตรวจสอบผลลัพธ์

หลังจากรัน script สำเร็จ คุณจะเห็น:

**ตารางที่ถูกสร้าง:**
- ✅ `companies` - 5 บริษัท
- ✅ `tags` - 8 tags
- ✅ `scopes` - 8 scopes
- ✅ `licenses` - 10 licenses

**ข้อมูลตัวอย่าง:**
- บริษัท เอเชีย ไทย อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด
- บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด
- นายอุทัย วิริยะพานิชภักดี
- บริษัท ซันมูน อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด
- บริษัท มิลเลี่ยน ฟรุ๊ต จำกัด

### 4. ทดสอบระบบ

หลังจากรัน script แล้ว:

1. **ทดสอบหน้าหลัก**
   - เปิด http://localhost:3000
   - ควรเห็นรายการ licenses ทั้งหมด

2. **ทดสอบ Settings Page**
   - เปิด http://localhost:3000/admin/settings
   - ลองเพิ่ม/แก้ไข/ลบ Companies, Tags, Scopes

3. **ทดสอบเพิ่ม License**
   - เปิด http://localhost:3000/admin
   - คลิก "เพิ่มใบอนุญาตใหม่"
   - ตรวจสอบว่า dropdowns แสดงข้อมูล Companies, Tags, Scopes
   - ลองสร้าง license ใหม่

## โครงสร้างฐานข้อมูล

### Companies Table
```
- id (UUID, Primary Key)
- name (TEXT, UNIQUE)
- address (TEXT)
- contact_person (TEXT)
- email (TEXT)
- phone (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tags Table
```
- id (UUID, Primary Key)
- name (TEXT, UNIQUE)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Scopes Table
```
- id (UUID, Primary Key)
- standard_code (TEXT)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(standard_code, description)
```

### Licenses Table
```
- id (UUID, Primary Key)
- registration_no (TEXT, UNIQUE)
- company_id (UUID, Foreign Key → companies)
- tag_id (UUID, Foreign Key → tags)
- scope_id (UUID, Foreign Key → scopes)
- certification_authority (TEXT)
- effective_date (DATE)
- valid_until (DATE)
- status (TEXT)
- remark (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Indexes
สร้าง indexes เพื่อเพิ่มประสิทธิภาพ:
- `idx_licenses_valid_until`
- `idx_licenses_company_id`
- `idx_licenses_tag_id`
- `idx_licenses_scope_id`
- `idx_licenses_status`
- `idx_companies_name`
- `idx_tags_name`
- `idx_scopes_standard_code`

## หากเกิดปัญหา

### ปัญหา: Script รันไม่สำเร็จ
**วิธีแก้:**
1. ตรวจสอบว่าไม่มี syntax error
2. ลองรันทีละส่วน (DROP → CREATE → INSERT)
3. ตรวจสอบ Supabase logs

### ปัญหา: ข้อมูลไม่แสดงในหน้าเว็บ
**วิธีแก้:**
1. Refresh browser (Ctrl+F5)
2. ตรวจสอบ Console ใน Browser DevTools
3. ตรวจสอบว่า API routes ทำงานถูกต้อง:
   - http://localhost:3000/api/companies
   - http://localhost:3000/api/tags
   - http://localhost:3000/api/scopes
   - http://localhost:3000/api/licenses

### ปัญหา: Foreign Key Constraint Error
**วิธีแก้:**
1. ตรวจสอบว่า companies, tags, scopes ถูกสร้างก่อน licenses
2. ลองรัน script ใหม่อีกครั้ง

## ขั้นตอนถัดไป

หลังจากสร้างฐานข้อมูลเสร็จแล้ว:
1. ✅ ทดสอบทุกฟีเจอร์
2. ⏳ เพิ่ม Row Level Security (RLS)
3. ⏳ เพิ่ม Validation
4. ⏳ เพิ่ม Pagination/Search
