-- Fix get_member_progress to sum stamp quantities instead of counting rows
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
  v_member RECORD;
  v_stamp_count INTEGER;
BEGIN
  -- Get member info
  SELECT * INTO v_member FROM members WHERE id = p_member_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Calculate TOTAL stamp count (sum of quantities, not row count)
  SELECT COALESCE(SUM(quantity), 0) INTO v_stamp_count
  FROM stamps
  WHERE member_id = p_member_id;
  
  -- Return progress for each tier at member's current level
  RETURN QUERY
  WITH tier_rewards AS (
    SELECT 
      rt.id as tier_id,
      rt.level_threshold,
      rt.stamp_threshold,
      rt.claim_deadline_days,
      c.id as claim_id,
      c.status as claim_status,
      CASE 
        WHEN c.id IS NOT NULL THEN true
        ELSE false
      END as already_claimed,
      CASE 
        WHEN v_stamp_count >= rt.stamp_threshold THEN true
        ELSE false
      END as eligible
    FROM reward_tiers rt
    LEFT JOIN claims c ON c.member_id = p_member_id AND c.tier = rt.id
    WHERE rt.level_threshold = v_member.level
  )
  SELECT 
    tr.tier_id::text,
    tr.stamp_threshold as threshold,
    tr.eligible,
    tr.already_claimed,
    COALESCE(tr.claim_status, '')::text as claim_status,
    v_stamp_count as live_stamp_count,
    v_stamp_count as lifetime_stamp_count
  FROM tier_rewards tr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
