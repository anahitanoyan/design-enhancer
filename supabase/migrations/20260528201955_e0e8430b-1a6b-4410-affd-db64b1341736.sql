CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  location text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  event_type text NOT NULL DEFAULT 'personal',
  color text NOT NULL DEFAULT 'bg-primary',
  attendees text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own events" ON public.events FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users update own events" ON public.events FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users delete own events" ON public.events FOR DELETE USING (auth.uid() = owner_id);

CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_events_owner_starts ON public.events(owner_id, starts_at);