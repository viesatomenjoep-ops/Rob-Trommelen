-- 1. Create the property_results table
CREATE TABLE IF NOT EXISTS property_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    event_name TEXT NOT NULL,
    level TEXT NOT NULL,
    result TEXT NOT NULL,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Set up row level security
ALTER TABLE property_results ENABLE ROW LEVEL SECURITY;

-- 3. Delete old policies if they exist
DROP POLICY IF EXISTS "Unlimited access property_results" ON property_results;

-- 4. Recreate policies
CREATE POLICY "Unlimited access property_results" ON property_results FOR ALL USING (true) WITH CHECK (true);

-- 5. Grant permissions to anon and authenticated users
GRANT ALL ON TABLE public.property_results TO anon, authenticated;

-- 6. Reload schema
NOTIFY pgrst, 'reload schema';
