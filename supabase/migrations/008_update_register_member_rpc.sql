-- ============================================================
-- STUDIOVERSE LOYALTY APP — UPDATE REGISTER_MEMBER FOR EMAIL/BIRTHDATE
-- Migration: 008_update_register_member_rpc.sql
-- Depends on: 001-007 (all previous migrations)
--
-- Updates register_member function to accept email and birth_date
-- while maintaining all existing referral logic
-- ============================================================

-- ------------------------------------------------------------
-- UPDATE register_member function
-- Maintains existing logic from migration 004 while adding
-- email and birth_date parameters
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION register_member(
  p_auth_user_id uuid,
  p_phone text,
  p_name text,
  p_card_theme card_theme,
  p_referral_code text default null,
  p_email text default null,
  p_birth_date date default null
)
returns members as $$
declare
  v_referrer_id uuid;
  v_new_member members;
  v_own_code text;
begin
  -- Validate that phone is not already registered
  if exists (select 1 from members where phone = p_phone) then
    raise exception 'Phone number already registered';
  end if;

  -- Validate email uniqueness if provided
  if p_email is not null and exists (select 1 from members where email = p_email) then
    raise exception 'Email already registered';
  end if;

  -- Resolve referrer, if a valid code was supplied
  if p_referral_code is not null then
    select id into v_referrer_id
    from members
    where referral_code = upper(trim(p_referral_code));
  end if;

  -- Generate unique referral code
  v_own_code := generate_referral_code();

  -- Insert new member with email and birth_date
  insert into members (id, phone, name, email, birth_date, card_theme, level, referred_by, referral_code)
  values (p_auth_user_id, p_phone, p_name, p_email, p_birth_date, p_card_theme, 1, v_referrer_id, v_own_code)
  returning * into v_new_member;

  -- Grant stamp bonuses based on referral status
  if v_referrer_id is not null then
    -- Referee: 2 welcome + 1 referral bonus, combined as one row, qty 3.
    -- (Referrer's bonus is NOT paid here — see trigger in migration 004)
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
-- 1. Maintains all existing logic from migration 004:
--    - Referrer bonus still paid via trigger (migration 004)
--    - Stamp quantities unchanged (2 welcome, or 3 with referral)
--    - Card theme validation via card_theme type
-- 2. New parameters:
--    - p_email: optional, validated for uniqueness
--    - p_birth_date: optional, no validation
-- 3. Existing members without email/birth_date will continue to work
-- 4. The trg_referrer_bonus_on_first_photo trigger (migration 004)
--    still works correctly with email/birth_date present
