-- Create news table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read-only)
CREATE POLICY "Public news are viewable by everyone." ON news
  FOR SELECT USING (true);

-- Create policies for authenticated admins (All access)
CREATE POLICY "Admins can manage news." ON news
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Grant privileges to standard web roles
GRANT ALL ON TABLE news TO anon, authenticated, service_role;
