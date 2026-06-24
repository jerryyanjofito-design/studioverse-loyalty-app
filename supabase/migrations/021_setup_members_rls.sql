-- Setup RLS policies for members table
-- Allow authenticated users to read their own member data

-- Enable RLS on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own member data" ON members;
DROP POLICY IF EXISTS "Users can update own member data" ON members;

-- Create policy to allow users to read their own member data
CREATE POLICY "Users can view own member data" ON members
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own member data  
CREATE POLICY "Users can update own member data" ON members
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to do everything (for Edge Functions)
GRANT ALL ON members TO service_role;
