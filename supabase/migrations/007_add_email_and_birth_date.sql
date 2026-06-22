-- Add email and birth_date columns to members table
-- This migration adds support for email recovery and birthday promotions

-- Add email column (optional, with unique constraint)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Add birth_date column (optional)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Add index for email lookups (for password recovery)
CREATE INDEX IF NOT EXISTS members_email_idx ON members(email);

-- Add comment for documentation
COMMENT ON COLUMN members.email IS 'Optional email address for password recovery and notifications';
COMMENT ON COLUMN members.birth_date IS 'Optional birth date for birthday promotions and special offers';
