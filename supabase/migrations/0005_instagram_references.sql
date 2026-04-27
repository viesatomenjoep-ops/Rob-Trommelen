CREATE TABLE IF NOT EXISTS instagram_references (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url TEXT NOT NULL,
    property_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS policies
ALTER TABLE instagram_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on instagram_references"
    ON instagram_references FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access on instagram_references"
    ON instagram_references FOR ALL
    USING (auth.role() = 'authenticated');
