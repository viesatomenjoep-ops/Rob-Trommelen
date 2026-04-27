-- Add a sort_order column to the properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Optional: Initialize sort_order to match the current chronological order so the current display isn't changed abruptly
WITH ordered_properties AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_order
  FROM properties
)
UPDATE properties
SET sort_order = ordered_properties.new_order
FROM ordered_properties
WHERE properties.id = ordered_properties.id;
