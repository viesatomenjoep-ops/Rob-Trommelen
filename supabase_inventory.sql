-- 1. Create the inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Voer', 'Supplementen', 'Verzorging', 'Materialen'
    description TEXT,
    quantity NUMERIC DEFAULT 0,
    unit TEXT DEFAULT 'stuks', -- e.g., 'kg', 'flessen', 'zakken'
    low_stock_threshold NUMERIC DEFAULT 5,
    supplier TEXT,
    purchase_price NUMERIC DEFAULT 0,
    selling_price NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- In case the table already exists, add the columns
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS purchase_price NUMERIC DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS selling_price NUMERIC DEFAULT 0;

-- 2. Create the inventory logs table (to track who took what and when)
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL, -- Name of the person making the change
    change_amount NUMERIC NOT NULL, -- Positive for adding stock, negative for removing
    reason TEXT, -- e.g., 'Gevoerd aan de paarden', 'Nieuwe levering ontvangen'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS) so the website can read/write
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Allow unlimited access for now (since we use the app logic to secure it)
DROP POLICY IF EXISTS "Unlimited access inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "Unlimited access inventory_logs" ON inventory_logs;
CREATE POLICY "Unlimited access inventory_items" ON inventory_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Unlimited access inventory_logs" ON inventory_logs FOR ALL USING (true) WITH CHECK (true);

-- 4. Notify PostgREST to reload the schema so the API works immediately
NOTIFY pgrst, 'reload schema';
