-- ============================================================
-- STUDIOVERSE LOYALTY APP — PASSWORD HINT SYSTEM
-- Migration: 009_add_password_hint.sql
-- Depends on: 001-008 (all previous migrations)
--
-- Adds password_hint column for hint-based password recovery
-- ============================================================

-- ------------------------------------------------------------
-- ADD password_hint column (optional, text field)
-- ------------------------------------------------------------
ALTER TABLE members
ADD COLUMN IF NOT EXISTS password_hint TEXT;

-- ------------------------------------------------------------
-- ADD comment for documentation
-- ------------------------------------------------------------
COMMENT ON COLUMN members.password_hint IS 'Optional password hint chosen by user during registration (e.g., "A****Z" for first & last letters, or custom pattern)';

-- ------------------------------------------------------------
-- NOTES
-- ------------------------------------------------------------
-- 1. Password hint is optional (nullable)
-- 2. Can store any text format user chooses
-- 3. Used to help user remember their password without storing the actual password
-- 4. Next migration (010) will update register_member to handle this parameter
