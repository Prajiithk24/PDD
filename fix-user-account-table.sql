-- Run these in Supabase SQL Editor to fix the user_account table

-- Add missing username column (if not exists)
ALTER TABLE user_account ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Add missing village column (if not exists)  
ALTER TABLE user_account ADD COLUMN IF NOT EXISTS village VARCHAR(255);

-- Verify the columns now
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'user_account' ORDER BY ordinal_position;
