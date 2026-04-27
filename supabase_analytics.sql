-- Add views column to properties table if it doesn't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create an RPC function to safely increment the views counter
-- This prevents race conditions when multiple users view at the same time
CREATE OR REPLACE FUNCTION increment_property_view(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET views = views + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for the function
GRANT EXECUTE ON FUNCTION increment_property_view(UUID) TO anon, authenticated;

-- Reload schema
NOTIFY pgrst, 'reload schema';
