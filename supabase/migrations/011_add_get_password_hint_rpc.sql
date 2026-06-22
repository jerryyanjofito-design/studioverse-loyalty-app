-- ============================================================
-- STUDIOVERSE LOYALTY APP — GET PASSWORD HINT RPC
-- Migration: 011_add_get_password_hint_rpc.sql
-- Depends on: 001-010 (all previous migrations)
--
-- Adds public RPC function to retrieve password hint by phone number
-- Used by "Lupa Password?" feature for unauthenticated users
-- ============================================================

-- ------------------------------------------------------------
-- CREATE get_password_hint_by_phone function
-- Allows unauthenticated users to retrieve password hint
-- Returns only password_hint field (not password or sensitive data)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_password_hint_by_phone(p_phone text)
returns json as $$
declare
  v_hint text;
begin
  -- Query password hint by phone
  select password_hint into v_hint
  from members
  where phone = p_phone;

  -- If phone not found, return null
  if v_hint is null then
    return json_build_object('found', false);
  end if;

  -- If password hint is empty/never set
  if v_hint = '' then
    return json_build_object(
      'found', true,
      'has_hint', false
    );
  end if;

  -- Return password hint
  return json_build_object(
    'found', true,
    'has_hint', true,
    'password_hint', v_hint
  );
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------
-- GRANT execute to public (authenticated and anon)
-- This function only returns non-sensitive password_hint field
-- ------------------------------------------------------------
GRANT EXECUTE ON FUNCTION get_password_hint_by_phone(text) TO anon;
GRANT EXECUTE ON FUNCTION get_password_hint_by_phone(text) TO authenticated;

-- ------------------------------------------------------------
-- NOTES
-- ------------------------------------------------------------
-- 1. Uses security definer to bypass RLS (user not logged in yet)
-- 2. Only returns password_hint field (not password, email, etc)
-- 3. Returns JSON with structured response for easy frontend handling
-- 4. Safe for public access since password_hint is user-provided hint only
