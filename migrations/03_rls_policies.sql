-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Purpose: Secure database tables by restricting access to authenticated users only.
-- ============================================

-- 1. Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies for Companies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON companies;
CREATE POLICY "Enable read access for authenticated users" ON companies
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON companies;
CREATE POLICY "Enable insert access for authenticated users" ON companies
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON companies;
CREATE POLICY "Enable update access for authenticated users" ON companies
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON companies;
CREATE POLICY "Enable delete access for authenticated users" ON companies
    FOR DELETE TO authenticated USING (true);

-- 3. Create Policies for Tags
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tags;
CREATE POLICY "Enable read access for authenticated users" ON tags
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON tags;
CREATE POLICY "Enable insert access for authenticated users" ON tags
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON tags;
CREATE POLICY "Enable update access for authenticated users" ON tags
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON tags;
CREATE POLICY "Enable delete access for authenticated users" ON tags
    FOR DELETE TO authenticated USING (true);

-- 4. Create Policies for Scopes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scopes;
CREATE POLICY "Enable read access for authenticated users" ON scopes
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON scopes;
CREATE POLICY "Enable insert access for authenticated users" ON scopes
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON scopes;
CREATE POLICY "Enable update access for authenticated users" ON scopes
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON scopes;
CREATE POLICY "Enable delete access for authenticated users" ON scopes
    FOR DELETE TO authenticated USING (true);

-- 5. Create Policies for Licenses
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON licenses;
CREATE POLICY "Enable read access for authenticated users" ON licenses
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON licenses;
CREATE POLICY "Enable insert access for authenticated users" ON licenses
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON licenses;
CREATE POLICY "Enable update access for authenticated users" ON licenses
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON licenses;
CREATE POLICY "Enable delete access for authenticated users" ON licenses
    FOR DELETE TO authenticated USING (true);

-- 6. Create Policies for Notification Logs
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON notification_logs;
CREATE POLICY "Enable read access for authenticated users" ON notification_logs
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON notification_logs;
CREATE POLICY "Enable insert access for authenticated users" ON notification_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- Note: Notification logs are typically read-only or append-only for users, 
-- but we'll allow update/delete for admin purposes if needed.
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON notification_logs;
CREATE POLICY "Enable update access for authenticated users" ON notification_logs
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON notification_logs;
CREATE POLICY "Enable delete access for authenticated users" ON notification_logs
    FOR DELETE TO authenticated USING (true);
