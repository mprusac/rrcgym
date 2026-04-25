
CREATE TYPE public.camp_discipline AS ENUM ('mma', 'kickbox', 'boks', 'jiu_jitsu', 'drugo');

CREATE TABLE public.camp_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  age SMALLINT,
  club TEXT,
  weight_class TEXT,
  discipline public.camp_discipline NOT NULL,
  experience_level TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  sparring_partners SMALLINT NOT NULL DEFAULT 1,
  accommodation TEXT NOT NULL,
  dietary_notes TEXT,
  injuries TEXT,
  extra_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.camp_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a valid camp reservation"
  ON public.camp_reservations FOR INSERT
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 100
    AND length(trim(email)) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(trim(phone)) BETWEEN 5 AND 30
    AND length(trim(country)) BETWEEN 2 AND 60
    AND length(trim(experience_level)) BETWEEN 2 AND 60
    AND length(trim(accommodation)) BETWEEN 2 AND 60
    AND arrival_date >= CURRENT_DATE
    AND departure_date >= arrival_date
    AND sparring_partners BETWEEN 0 AND 20
  );
