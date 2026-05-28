-- Extend profiles with personal fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'Admin';

-- Family members table
CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  email text,
  phone text,
  avatar_initials text,
  status text NOT NULL DEFAULT 'active',
  joined_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their family members"
  ON public.family_members FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners insert their family members"
  ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners update their family members"
  ON public.family_members FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners delete their family members"
  ON public.family_members FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

CREATE TRIGGER family_members_set_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_family_members_owner ON public.family_members(owner_id);