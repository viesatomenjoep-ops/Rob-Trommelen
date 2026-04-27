-- Add category to properties table to separate Sales and Investment properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS category text DEFAULT 'sales';

-- Optional: If you want to restrict the values, uncomment below
-- ALTER TABLE properties ADD CONSTRAINT check_property_category CHECK (category IN ('sales', 'investment'));
