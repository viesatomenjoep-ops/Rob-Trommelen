-- 1. Create the quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote_number TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_address TEXT,
    client_company TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    subtotal NUMERIC DEFAULT 0,
    tax_rate NUMERIC DEFAULT 21,
    tax_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'paid'
    type TEXT DEFAULT 'quote', -- 'quote' or 'order'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure the type column exists if the table is already created
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'quote';

-- 2. Create the quote items table
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC DEFAULT 1,
    unit_price NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Set up row level security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- 4. Delete old policies if they exist
DROP POLICY IF EXISTS "Unlimited access quotes" ON quotes;
DROP POLICY IF EXISTS "Unlimited access quote_items" ON quote_items;

-- 5. Recreate policies
CREATE POLICY "Unlimited access quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Unlimited access quote_items" ON quote_items FOR ALL USING (true) WITH CHECK (true);

-- 6. Grant permissions to anon and authenticated users
GRANT ALL ON TABLE public.quotes TO anon, authenticated;
GRANT ALL ON TABLE public.quote_items TO anon, authenticated;

-- 7. Reload schema
NOTIFY pgrst, 'reload schema';
