-- ============================================================
-- STUDIOVERSE LOYALTY APP — FIX GET PASSWORD HINT RPC
-- Migration: 012_fix_get_password_hint_rpc.sql
-- Depends on: 001-011 (all previous migrations)
--
-- BUG FIX: Original function incorrectly returned {found: false}
-- when password_hint was NULL, even though member existed.
--
-- This version:
-- 1. First checks if member exists (by phone)
-- 2. Then returns appropriate response based on password_hint status
-- ============================================================

-- ------------------------------------------------------------
-- CREATE/FIX get_password_hint_by_phone function
-- Fixed logic to properly distinguish between:
-- - Member not found (phone doesn't exist)
-- - Member found but no password_hint set
-- - Member found with password_hint
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_password_hint_by_phone(p_phone text)
returns json as $$
declare
  v_member_exists boolean;
  v_hint text;
begin
  -- Step 1: Check if member exists by phone number
  select exists(
    select 1 from members where phone = p_phone
  ) into v_member_exists;

  -- If phone doesn't exist, return not found
  if not v_member_exists then
    return json_build_object('found', false);
  end if;

  -- Step 2: Member exists, now get password hint
  select password_hint into v_hint
  from members
  where phone = p_phone;

  -- If password_hint is NULL or empty string
  if v_hint is null or v_hint = '' then
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
-- RE-GRANT execute permissions (create or replace preserves them)
-- ------------------------------------------------------------
GRANT EXECUTE ON FUNCTION get_password_hint_by_phone(text) TO anon;
GRANT EXECUTE ON FUNCTION get_password_hint_by_phone(text) TO authenticated;

-- ------------------------------------------------------------
-- NOTES
-- ------------------------------------------------------------
-- 1. Fixes bug where NULL password_hint was treated as "member not found"
-- 2. Now properly distinguishes 3 states:
--    - Member not found: {"found": false}
--    - Member found, no hint: {"found": true, "has_hint": false}
--    - Member found, has hint: {"found": true, "has_hint": true, "password_hint": "..."}
-- 3. Uses security definer to bypass RLS (for unauthenticated users)
-- 4. Safe for public access (only returns non-sensitive password_hint field)
