-- ============================================
-- Fresh Database Setup for License Tracking System
-- ============================================
-- This script will DROP existing tables and create new ones
-- WARNING: This will DELETE all existing data!
-- ============================================

-- 1. Drop existing tables (if any)
DROP TABLE IF EXISTS licenses CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS scopes CASCADE;

-- 2. Create Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    address TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Scopes table
CREATE TABLE scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_code TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(standard_code, description)
);

-- 5. Create Licenses table with foreign keys
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_no TEXT NOT NULL UNIQUE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    tag_id UUID REFERENCES tags(id) ON DELETE SET NULL,
    scope_id UUID REFERENCES scopes(id) ON DELETE SET NULL,
    certification_authority TEXT,
    effective_date DATE,
    valid_until DATE NOT NULL,
    status TEXT DEFAULT 'Active',
    remark TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for better performance
CREATE INDEX idx_licenses_valid_until ON licenses(valid_until);
CREATE INDEX idx_licenses_company_id ON licenses(company_id);
CREATE INDEX idx_licenses_tag_id ON licenses(tag_id);
CREATE INDEX idx_licenses_scope_id ON licenses(scope_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_scopes_standard_code ON scopes(standard_code);

-- ============================================
-- Insert Sample Data
-- ============================================

-- Insert Companies
INSERT INTO companies (name, address, contact_person, email, phone) VALUES
('บริษัท เอเชีย ไทย อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'กรุงเทพฯ', 'คุณสมชาย', 'contact@asiathai.com', '02-123-4567'),
('บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'กรุงเทพฯ', 'คุณสมหญิง', 'info@success.com', '02-234-5678'),
('นายอุทัย วิริยะพานิชภักดี', 'นนทบุรี', 'นายอุทัย', 'uthai@email.com', '08-1234-5678'),
('บริษัท ซันมูน อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'สมุทรปราการ', 'คุณดวงจันทร์', 'contact@sunmoon.com', '02-345-6789'),
('บริษัท มิลเลี่ยน ฟรุ๊ต จำกัด', 'ชลบุรี', 'คุณมิลลิ', 'info@millionfruit.com', '038-123-456');

-- Insert Tags
INSERT INTO tags (name, description) VALUES
('SG', 'Singapore Export'),
('DOA', 'Department of Agriculture'),
('JP', 'Japan Export'),
('CN', 'China Export'),
('EU', 'European Union Export'),
('DU', 'Durian Export'),
('MOKORSOR2FROZENDURIAN', 'มกษ.2 ทุเรียนแช่เยือกแข็ง'),
('MOKORSOR4SULFURDIOXIDE', 'มกษ.4 ก๊าซซัลเฟอร์ไดออกไซด์');

-- Insert Scopes
INSERT INTO scopes (standard_code, description) VALUES
('สมพ.๑๒', 'ส่งออกผักและผลไม้'),
('กมพ.๒๑', 'การขึ้นทะเบียนโรงงานผลิตสินค้าพืช'),
('กมพ.๒๗', 'ส่งออกทุเรียนสด'),
('มกษ.2', 'ผู้ผลิตทุเรียนแช่เยือกแข็ง'),
('มกษ.4', 'ผู้ผลิตผลไม้สดรมด้วยก๊าซซัลเฟอร์ไดออกไซด์'),
('GAP', 'Good Agricultural Practices'),
('GMP', 'Good Manufacturing Practice'),
('HACCP', 'Hazard Analysis and Critical Control Points');

-- Insert Sample Licenses
-- Note: We need to get the IDs from the inserted companies, tags, and scopes
INSERT INTO licenses (
    registration_no, 
    company_id, 
    tag_id, 
    scope_id, 
    certification_authority, 
    effective_date, 
    valid_until, 
    status
)
SELECT 
    'SG-20-013',
    (SELECT id FROM companies WHERE name = 'บริษัท เอเชีย ไทย อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'SG'),
    (SELECT id FROM scopes WHERE standard_code = 'สมพ.๑๒'),
    'กรมวิชาการเกษตร',
    '2020-03-31'::DATE,
    '2022-03-30'::DATE,
    'Expired'
UNION ALL
SELECT 
    'DOA 45000 99 130213',
    (SELECT id FROM companies WHERE name = 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'DOA'),
    (SELECT id FROM scopes WHERE standard_code = 'กมพ.๒๑'),
    'กรมวิชาการเกษตร',
    '2022-12-09'::DATE,
    '2024-12-08'::DATE,
    'Expired'
UNION ALL
SELECT 
    'JP-21-050',
    (SELECT id FROM companies WHERE name = 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'JP'),
    (SELECT id FROM scopes WHERE standard_code = 'สมพ.๑๒'),
    'กรมวิชาการเกษตร',
    '2023-10-05'::DATE,
    '2025-10-04'::DATE,
    'Active'
UNION ALL
SELECT 
    'DOA 45000 02 133216',
    (SELECT id FROM companies WHERE name = 'นายอุทัย วิริยะพานิชภักดี'),
    (SELECT id FROM tags WHERE name = 'DOA'),
    (SELECT id FROM scopes WHERE standard_code = 'กมพ.๒๑'),
    'กรมวิชาการเกษตร',
    '2024-01-19'::DATE,
    '2026-01-18'::DATE,
    'Active'
UNION ALL
SELECT 
    'ACFS90460200097',
    (SELECT id FROM companies WHERE name = 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'MOKORSOR2FROZENDURIAN'),
    (SELECT id FROM scopes WHERE standard_code = 'มกษ.2'),
    'กรมวิชาการเกษตร',
    '2023-02-28'::DATE,
    '2026-02-27'::DATE,
    'Active'
UNION ALL
SELECT 
    'DU-1-48-089',
    (SELECT id FROM companies WHERE name = 'บริษัท ซันมูน อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'DU'),
    (SELECT id FROM scopes WHERE standard_code = 'กมพ.๒๗'),
    'กรมวิชาการเกษตร',
    '2024-04-12'::DATE,
    '2026-04-11'::DATE,
    'Active'
UNION ALL
SELECT 
    'CN1572',
    (SELECT id FROM companies WHERE name = 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'CN'),
    (SELECT id FROM scopes WHERE standard_code = 'สมพ.๑๒'),
    'กรมวิชาการเกษตร',
    '2025-08-15'::DATE,
    '2027-08-14'::DATE,
    'Active'
UNION ALL
SELECT 
    'ACFS10040400004',
    (SELECT id FROM companies WHERE name = 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'MOKORSOR4SULFURDIOXIDE'),
    (SELECT id FROM scopes WHERE standard_code = 'มกษ.4'),
    'กรมวิชาการเกษตร',
    '2024-05-04'::DATE,
    '2028-05-03'::DATE,
    'Active'
UNION ALL
SELECT 
    'EU-08-029',
    (SELECT id FROM companies WHERE name = 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'EU'),
    (SELECT id FROM scopes WHERE standard_code = 'สมพ.๑๒'),
    'กรมวิชาการเกษตร',
    '2023-08-18'::DATE,
    '2025-08-17'::DATE,
    'Expired'
UNION ALL
SELECT 
    'JP-21-052',
    (SELECT id FROM companies WHERE name = 'บริษัท มิลเลี่ยน ฟรุ๊ต จำกัด'),
    (SELECT id FROM tags WHERE name = 'JP'),
    (SELECT id FROM scopes WHERE standard_code = 'สมพ.๑๒'),
    'กรมวิชาการเกษตร',
    '2025-11-14'::DATE,
    '2027-11-13'::DATE,
    'Active';

-- ============================================
-- Verification Queries
-- ============================================

-- Check counts
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Tags', COUNT(*) FROM tags
UNION ALL
SELECT 'Scopes', COUNT(*) FROM scopes
UNION ALL
SELECT 'Licenses', COUNT(*) FROM licenses;

-- View sample data with joins
SELECT 
    l.registration_no,
    c.name AS company_name,
    t.name AS tag_name,
    s.standard_code,
    s.description AS scope_description,
    l.certification_authority,
    l.effective_date,
    l.valid_until,
    l.status
FROM licenses l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN tags t ON l.tag_id = t.id
LEFT JOIN scopes s ON l.scope_id = s.id
ORDER BY l.valid_until DESC;
