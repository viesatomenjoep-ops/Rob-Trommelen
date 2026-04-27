CREATE TABLE IF NOT EXISTS site_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    hero_image TEXT,
    content_blocks JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON site_pages FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON site_pages FOR ALL USING (true) WITH CHECK (true);

-- Insert default investors page if it doesn't exist
INSERT INTO site_pages (slug, title, hero_image, content_blocks) 
VALUES (
  'investors', 
  'Invest in Excellence', 
  '/about-bg.jpg', 
  '[
    {"id": "1", "type": "heading", "content": "Why Invest in Showjumpers?", "size": "text-4xl"},
    {"id": "2", "type": "text", "content": "The equestrian sport has transitioned from a passion-driven pursuit into a highly professional, multi-billion-dollar global industry. At the pinnacle of this industry sits the showjumping market, where demand for top-tier equine athletes consistently outpaces supply.", "size": "text-lg"},
    {"id": "3", "type": "text", "content": "By partnering with Equivest, you gain direct access to our extensive network in the heart of the equestrian world: the Netherlands, Belgium, and Germany. We meticulously select, train, and export exceptional properties to the United States, where the market commands significant premiums.", "size": "text-lg"},
    {"id": "4", "type": "heading", "content": "Return on Investment (ROI)", "size": "text-4xl"},
    {"id": "5", "type": "text", "content": "Investing in sport properties is classified as an alternative asset class. While it carries inherent risks, the potential returns significantly outpace traditional markets when managed by experts.", "size": "text-lg"}
  ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;
