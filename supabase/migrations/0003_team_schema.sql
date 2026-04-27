-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read-only)
CREATE POLICY "Public team members are viewable by everyone." ON team_members
  FOR SELECT USING (true);

-- Create policies for authenticated admins (All access)
CREATE POLICY "Admins can manage team members." ON team_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Grant privileges to standard web roles
GRANT ALL ON TABLE team_members TO anon, authenticated, service_role;
