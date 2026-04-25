
-- Enum for training disciplines
CREATE TYPE public.training_discipline AS ENUM ('mma', 'kickbox', 'boks', 'jiu_jitsu');

-- Schedule of training sessions
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline public.training_discipline NOT NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  coach TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'svi nivoi',
  capacity INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view training sessions"
  ON public.training_sessions FOR SELECT
  USING (true);

-- Signups submitted by visitors
CREATE TABLE public.training_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age SMALLINT,
  experience TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a signup"
  ON public.training_signups FOR INSERT
  WITH CHECK (true);
