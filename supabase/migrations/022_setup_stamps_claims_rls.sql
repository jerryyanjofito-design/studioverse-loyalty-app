-- Setup RLS policies for stamps and claims tables

-- Stamps table
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own stamps" ON stamps;
DROP POLICY IF EXISTS "Service role can manage stamps" ON stamps;

CREATE POLICY "Users can view own stamps" ON stamps
  FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Service role can manage stamps" ON stamps
  FOR ALL
  USING (true);

-- Claims table (might be named claims or reward_claims)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'claims') THEN
    ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own claims" ON claims;
    DROP POLICY IF EXISTS "Service role can manage claims" ON claims;
    
    CREATE POLICY "Users can view own claims" ON claims
      FOR SELECT
      USING (auth.uid() = member_id);
      
    CREATE POLICY "Service role can manage claims" ON claims
      FOR ALL
      USING (true);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reward_claims') THEN
    ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own claims" ON reward_claims;
    DROP POLICY IF EXISTS "Service role can manage claims" ON reward_claims;
    
    CREATE POLICY "Users can view own claims" ON reward_claims
      FOR SELECT
      USING (auth.uid() = member_id);
      
    CREATE POLICY "Service role can manage claims" ON reward_claims
      FOR ALL
      USING (true);
  END IF;
END $$;
