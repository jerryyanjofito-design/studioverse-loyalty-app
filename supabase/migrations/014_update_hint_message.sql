-- ============================================================
-- STUDIOVERSE LOYALTY APP — UPDATE PASSWORD HINT MESSAGE
-- Migration: 014_update_hint_message.sql
-- Depends on: 001-013 (all previous migrations)
--
-- Updates get_password_hint_by_phone to return clearer message
-- when password_hint is NULL
-- ============================================================

-- ------------------------------------------------------------
-- UPDATE get_password_hint_by_phone function
-- Improved message for members without password hint
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_password_hint_by_phone(p_phone text)
returns json as $$
declare
  v_member_exists boolean;
  v_hint text;
begin
  -- Cek dulu apakah member ada
  select exists(
    select 1 from members where phone = p_phone
  ) into v_member_exists;

  if not v_member_exists then
    return json_build_object('found', false);
  end if;

  -- Member ada, ambil password hint
  select password_hint into v_hint
  from members
  where phone = p_phone;

  -- Kalau password_hint NULL atau empty
  if v_hint is null or v_hint = '' then
    return json_build_object(
      'found', true,
      'has_hint', false,
      'message', 'Maaf, password hint tidak tersedia untuk akun ini. Silakan coba mengingat password Anda atau hubungi kasir untuk bantuan.'
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

-- Re-grant permissions
GRANT EXECUTE ON FUNCTION get_password_hint_by_phone(text) TO anon;
GRANT EXECUTE ON FUNCTION get_password_hint_by_phone(text) TO authenticated;
