
DROP POLICY "Anyone can submit a signup" ON public.training_signups;

CREATE POLICY "Anyone can submit a valid signup"
  ON public.training_signups FOR INSERT
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 100
    AND length(trim(email)) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(trim(phone)) BETWEEN 5 AND 30
    AND session_id IS NOT NULL
  );
