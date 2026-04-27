-- Kopieer dit en plak het in je Supabase SQL editor:
-- Ga in Supabase naar: SQL Editor (aan de linkerkant) -> New query
-- Plak deze tekst en klik op "Run" rechtsonder.

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS investment_rationale TEXT,
ADD COLUMN IF NOT EXISTS estimated_roi TEXT;

-- Hierdoor worden de ROI velden aangemaakt in de database zonder dat oude data verloren gaat!
