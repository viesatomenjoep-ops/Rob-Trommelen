-- 1. Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Set up row level security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 3. Delete old policies if they exist
DROP POLICY IF EXISTS "Unlimited access appointments" ON appointments;

-- 4. Recreate policies
CREATE POLICY "Unlimited access appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);

-- 5. Grant permissions to anon and authenticated users
GRANT ALL ON TABLE public.appointments TO anon, authenticated;

-- 6. Reload schema
NOTIFY pgrst, 'reload schema';
