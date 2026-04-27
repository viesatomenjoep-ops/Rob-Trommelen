-- Create enum types
CREATE TYPE property_type AS ENUM ('Woonhuis', 'Appartement', 'Bedrijfspand', 'Overig');
CREATE TYPE property_status AS ENUM ('Beschikbaar', 'Verkocht onder voorbehoud', 'Verkocht', 'Verhuurd');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');
CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Closed');

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  street_address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Nederland',
  price NUMERIC NOT NULL,
  price_condition TEXT DEFAULT 'k.k.', -- k.k., v.o.n., p.m.
  type property_type NOT NULL,
  status property_status DEFAULT 'Beschikbaar' NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type media_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  message TEXT NOT NULL,
  status lead_status DEFAULT 'New' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read-only)
CREATE POLICY "Public profiles are viewable by everyone." ON properties
  FOR SELECT USING (true);

CREATE POLICY "Public media is viewable by everyone." ON media
  FOR SELECT USING (true);

-- Leads can be created by anyone (public inquiry form)
CREATE POLICY "Anyone can insert a lead." ON leads
  FOR INSERT WITH CHECK (true);

-- Create policies for authenticated admins (All access)
-- Assuming admin users are authenticated via Supabase Auth
CREATE POLICY "Admins can manage properties." ON properties
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage media." ON media
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view and manage leads." ON leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
