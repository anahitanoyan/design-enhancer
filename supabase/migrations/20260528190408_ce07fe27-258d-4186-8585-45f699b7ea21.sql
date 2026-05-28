
-- Fix SECURITY DEFINER linter warnings: revoke public execute
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- set_updated_at doesn't need SECURITY DEFINER
ALTER FUNCTION public.set_updated_at() SECURITY INVOKER;
ALTER FUNCTION public.set_updated_at() SET search_path = public;
