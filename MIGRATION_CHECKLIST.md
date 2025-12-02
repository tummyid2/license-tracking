# Database Migration Checklist

## ขั้นตอนที่ 1: Backup ข้อมูล (สำคัญมาก!)

1. เข้า Supabase Dashboard: https://app.supabase.com
2. เลือก Project ของคุณ
3. ไปที่ **Table Editor** → เลือกตาราง `licenses`
4. คลิก **Export** → **Export as CSV** เพื่อสำรองข้อมูล

## ขั้นตอนที่ 2: รัน Migration Script

1. ไปที่ **SQL Editor** ใน Supabase Dashboard
2. คลิก **New Query**
3. Copy โค้ดจากไฟล์ `migrations/01_normalization.sql`
4. Paste ลงใน SQL Editor
5. คลิก **Run** (Ctrl+Enter)

### SQL Script ที่ต้องรัน:

```sql
-- 1. Create new tables
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    address TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_code TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(standard_code, description)
);

-- 2. Migrate data from existing licenses table
INSERT INTO companies (name)
SELECT DISTINCT company FROM licenses WHERE company IS NOT NULL AND company != ''
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name)
SELECT DISTINCT tag FROM licenses WHERE tag IS NOT NULL AND tag != ''
ON CONFLICT (name) DO NOTHING;

INSERT INTO scopes (standard_code, description)
SELECT DISTINCT standard_scope, criteria_scope FROM licenses 
WHERE standard_scope IS NOT NULL AND criteria_scope IS NOT NULL
AND standard_scope != '' AND criteria_scope != ''
ON CONFLICT (standard_code, description) DO NOTHING;

-- 3. Add foreign keys to licenses table
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS tag_id UUID REFERENCES tags(id);
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS scope_id UUID REFERENCES scopes(id);

-- 4. Update foreign keys based on existing text data
UPDATE licenses l
SET company_id = c.id
FROM companies c
WHERE l.company = c.name AND l.company_id IS NULL;

UPDATE licenses l
SET tag_id = t.id
FROM tags t
WHERE l.tag = t.name AND l.tag_id IS NULL;

UPDATE licenses l
SET scope_id = s.id
FROM scopes s
WHERE l.standard_scope = s.standard_code 
AND l.criteria_scope = s.description 
AND l.scope_id IS NULL;
```

## ขั้นตอนที่ 3: ตรวจสอบผลลัพธ์

รันคำสั่งเหล่านี้เพื่อตรวจสอบ:

```sql
-- ตรวจสอบจำนวนข้อมูลในตารางใหม่
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Tags', COUNT(*) FROM tags
UNION ALL
SELECT 'Scopes', COUNT(*) FROM scopes;

-- ตรวจสอบว่า Foreign Keys ถูก Update แล้ว
SELECT 
  COUNT(*) as total_licenses,
  COUNT(company_id) as with_company,
  COUNT(tag_id) as with_tag,
  COUNT(scope_id) as with_scope
FROM licenses;

-- ตรวจสอบข้อมูลที่ Join แล้ว
SELECT 
  l.registration_no,
  c.name AS company_name,
  t.name AS tag_name,
  s.standard_code,
  s.description
FROM licenses l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN tags t ON l.tag_id = t.id
LEFT JOIN scopes s ON l.scope_id = s.id
LIMIT 5;
```

## ขั้นตอนที่ 4: ทดสอบระบบ

### 4.1 ทดสอบ Settings Page
1. เปิด http://localhost:3000/admin/settings
2. ลองเพิ่ม Company ใหม่
3. ลองแก้ไข Tag
4. ลองลบ Scope (ที่ไม่มีการใช้งาน)

### 4.2 ทดสอบ License Management
1. เปิดหน้าหลัก http://localhost:3000
2. คลิก "Add New License"
3. ตรวจสอบว่า dropdowns แสดง Companies, Tags, Scopes
4. ลองสร้าง License ใหม่
5. ลองแก้ไข License ที่มีอยู่

### 4.3 ตรวจสอบ API
```bash
# ทดสอบ API endpoints
curl http://localhost:3000/api/companies
curl http://localhost:3000/api/tags
curl http://localhost:3000/api/scopes
curl http://localhost:3000/api/licenses
```

## ขั้นตอนที่ 5: (Optional) ลบ Columns เก่า

**⚠️ ทำเฉพาะเมื่อแน่ใจว่าทุกอย่างทำงานถูกต้อง!**

```sql
ALTER TABLE licenses DROP COLUMN IF EXISTS company;
ALTER TABLE licenses DROP COLUMN IF EXISTS tag;
ALTER TABLE licenses DROP COLUMN IF EXISTS standard_scope;
ALTER TABLE licenses DROP COLUMN IF EXISTS criteria_scope;
```

## หากเกิดปัญหา - Rollback

```sql
-- ลบ Foreign Key Columns
ALTER TABLE licenses DROP COLUMN IF EXISTS company_id;
ALTER TABLE licenses DROP COLUMN IF EXISTS tag_id;
ALTER TABLE licenses DROP COLUMN IF EXISTS scope_id;

-- ลบตารางใหม่
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS scopes CASCADE;
```

## สรุป

- ✅ Backup ข้อมูล
- ✅ รัน Migration Script
- ✅ ตรวจสอบผลลัพธ์
- ✅ ทดสอบระบบ
- ⏳ (Optional) ลบ columns เก่า

---

**หมายเหตุ:** หากมีปัญหาใดๆ สามารถ rollback ได้ทันที เพราะข้อมูลเดิมยังอยู่ในตาราง licenses
