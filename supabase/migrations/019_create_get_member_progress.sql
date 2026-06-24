-- Create get_member_progress function that correctly sums stamp quantities
-- This function returns progress for each reward tier based on member's level and stamp count

DROP FUNCTION IF EXISTS public.get_member_progress(uuid);

CREATE OR REPLACE FUNCTION get_member_progress(p_member_id uuid)
RETURNS TABLE (
  tier text,
  threshold integer,
  eligible boolean,
  already_claimed boolean,
  claim_status text,
  live_stamp_count integer,
  lifetime_stamp_count integer
) AS $$
DECLARE
  v_member_level INTEGER;
  v_total_stamps INTEGER;
BEGIN
  -- Get member level
  SELECT level INTO v_member_level FROM members WHERE id = p_member_id;
  
  IF v_member_level IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate TOTAL stamp count (sum of quantities, not row count)
  SELECT COALESCE(SUM(quantity), 0) INTO v_total_stamps
  FROM stamps
  WHERE member_id = p_member_id;
  
  -- Return progress for each reward tier
  -- For level 1: free_spin (3), keychain_50off (6), free_photobooth (8)
  RETURN QUERY
  WITH reward_tiers_data AS (
    SELECT 
      'free_spin'::text as tier_id,
      3 as stamp_threshold
    UNION ALL
    SELECT 'keychain_50off'::text, 6
    UNION ALL
    SELECT 'free_photobooth'::text, 8
  ),
  claim_data AS (
    SELECT 
      tier,
      status as claim_status,
      CASE WHEN id IS NOT NULL THEN true ELSE false END as already_claimed
    FROM claims
    WHERE member_id = p_member_id
  )
  SELECT 
    rt.tier_id as tier,
    rt.stamp_threshold as threshold,
    CASE WHEN v_total_stamps >= rt.stamp_threshold THEN true ELSE false END as eligible,
    COALESCE(cd.already_claimed, false) as already_claimed,
    COALESCE(cd.claim_status, '') as claim_status,
    v_total_stamps as live_stamp_count,
    v_total_stamps as lifetime_stamp_count
  FROM reward_tiers_data rt
  LEFT JOIN claim_data cd ON cd.tier = rt.tier_id;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_member_progress(uuid) TO authenticated;
