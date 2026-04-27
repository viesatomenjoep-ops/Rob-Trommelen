-- 1. Create the admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'staff', -- 'superadmin' or 'staff'
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Set up row level security
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- 3. Delete old policies if they exist
DROP POLICY IF EXISTS "Unlimited access admin_permissions" ON admin_permissions;

-- 4. Recreate policies
CREATE POLICY "Unlimited access admin_permissions" ON admin_permissions FOR ALL USING (true) WITH CHECK (true);

-- 5. Grant permissions to anon and authenticated users
GRANT ALL ON TABLE public.admin_permissions TO anon, authenticated;

-- 6. Insert the Super Admin (tomvanbiene@gmail.com)
-- We use ON CONFLICT to avoid errors if it already exists
INSERT INTO admin_permissions (email, role, permissions) 
VALUES (
  'tomvanbiene@gmail.com', 
  'superadmin', 
  '{"all": true}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET role = 'superadmin', permissions = '{"all": true}'::jsonb;

-- Also add tomjo118735@gmail.com just in case he logs in with that
INSERT INTO admin_permissions (email, role, permissions) 
VALUES (
  'tomjo118735@gmail.com', 
  'superadmin', 
  '{"all": true}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET role = 'superadmin', permissions = '{"all": true}'::jsonb;

-- 7. Reload schema
NOTIFY pgrst, 'reload schema';
