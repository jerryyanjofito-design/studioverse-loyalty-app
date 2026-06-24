-- Simple version of get_member_progress
CREATE OR REPLACE FUNCTION public.get_member_progress(p_member_id uuid)
RETURNS TABLE (
  tier text,
  threshold integer,
  eligible boolean,
  already_claimed boolean,
  claim_status text,
  live_stamp_count integer,
  lifetime_stamp_count integer
) 
LANGUAGE plpgsql
SECURITY DEFINER

AS $$
DECLARE
  v_total_stamps INTEGER;
BEGIN
  -- Sum stamp quantities
  SELECT COALESCE(SUM(quantity), 0) INTO v_total_stamps
  FROM stamps
  WHERE member_id = p_member_id;
  
  -- Return all 3 reward tiers with same stamp count
  RETURN QUERY
  SELECT 'free_spin'::text, 3::int, 
         v_total_stamps >= 3, 
         false::boolean, 
         ''::text,
         v_total_stamps, v_total_stamps
  UNION ALL
  SELECT 'keychain_50off'::text, 6::int, 
         v_total_stamps >= 6, 
         false::boolean, 
         ''::text,
         v_total_stamps, v_total_stamps
  UNION ALL
  SELECT 'free_photobooth'::text, 8::int, 
         v_total_stamps >= 8, 
         false::boolean, 
         ''::text,
         v_total_stamps, v_total_stamps;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_member_progress(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_progress(uuid) TO anon;
