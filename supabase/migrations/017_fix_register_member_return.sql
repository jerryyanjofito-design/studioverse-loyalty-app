-- Fix register_member return type
DROP FUNCTION IF EXISTS public.register_member(
  p_auth_user_id uuid, 
  p_phone text, 
  p_name text, 
  p_card_theme text, 
  p_referral_code text, 
  p_email text, 
  p_birth_date date, 
  p_password_hint text
);

-- Create function with correct return type
CREATE OR REPLACE FUNCTION register_member(
  p_auth_user_id uuid,
  p_phone text,
  p_name text,
  p_card_theme text default 'classic',
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

  -- Generate unique referral code
  v_own_code := upper(substring(encode(decode(md5(random()::text), 'hex'), 'base64'), 1, 8));

  -- Insert new member
  insert into members (id, phone, name, card_theme, level, referred_by, referral_code, email, birth_date, password_hint)
  values (p_auth_user_id, p_phone, p_name, p_card_theme::card_theme, 1, v_referrer_id, v_own_code, p_email, p_birth_date, p_password_hint)
  returning * into v_new_member;

  -- Grant welcome stamp bonus
  insert into stamps (member_id, source, quantity)
  values (p_auth_user_id, 'welcome', 2);

  return v_new_member;
end;
$$ language plpgsql security definer;
