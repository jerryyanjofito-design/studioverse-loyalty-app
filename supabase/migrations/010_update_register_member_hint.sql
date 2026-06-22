-- ============================================================
-- STUDIOVERSE LOYALTY APP — UPDATE REGISTER_MEMBER FOR PASSWORD HINT
-- Migration: 010_update_register_member_hint.sql
-- Depends on: 001-009 (all previous migrations)
--
-- Updates register_member function to accept password_hint parameter
-- ============================================================

-- ------------------------------------------------------------
-- UPDATE register_member function
-- Maintains all existing logic while adding password_hint parameter
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION register_member(
  p_auth_user_id uuid,
  p_phone text,
  p_name text,
  p_card_theme card_theme,
  p_referral_code text default null,
  p_email text default null,
  p_birth_date date default null,
  p_password_hint text default null
)
returns members as $$
declare
  v_referrer_id uuid;
  v_new_member members;
  v_own_code text;
begin
  -- Validate phone uniqueness
  if exists (select 1 from members where phone = p_phone) then
    raise exception 'Phone number already registered';
  end if;

  -- Validate email uniqueness if provided
  if p_email is not null and exists (select 1 from members where email = p_email) then
    raise exception 'Email already registered';
  end if;

  -- Resolve referrer if code provided
  if p_referral_code is not null then
    select id into v_referrer_id
    from members
    where referral_code = upper(trim(p_referral_code));
  end if;

  -- Generate unique referral code
  v_own_code := generate_referral_code();

  -- Insert new member with all fields including password_hint
  insert into members (id, phone, name, card_theme, level, referred_by, referral_code, email, birth_date, password_hint)
  values (p_auth_user_id, p_phone, p_name, p_card_theme, 1, v_referrer_id, v_own_code, p_email, p_birth_date, p_password_hint)
  returning * into v_new_member;

  -- Grant stamp bonuses based on referral status
  if v_referrer_id is not null then
    -- Referee: 2 welcome + 1 referral bonus, combined as one row, qty 3.
    insert into stamps (member_id, source, quantity)
    values (v_new_member.id, 'referral_referee', 3);
  else
    -- No referral: plain welcome bonus, qty 2
    insert into stamps (member_id, source, quantity)
    values (v_new_member.id, 'welcome', 2);
  end if;

  return v_new_member;
end;
$$ language plpgsql security definer;

-- (Grants already set in migration 003; create or replace preserves them)

-- ------------------------------------------------------------
-- NOTES
-- ------------------------------------------------------------
-- 1. Maintains all existing logic from migrations 004-008
-- 2. New parameter p_password_hint is optional (default null)
-- 3. All other parameters unchanged (email, birth_date optional)
-- 4. Referral logic unchanged (trigger still works)
-- 5. Stamp bonuses unchanged (2 welcome, or 3 with referral)
