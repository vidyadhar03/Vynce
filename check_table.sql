-- Check existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check if Vynce_User table exists with any case
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND lower(table_name) = 'vynce_user';

-- Check table definition
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND lower(table_name) = 'vynce_user';

-- Check if there is any data in the table
SELECT COUNT(*) FROM "vynce_user";

-- Insert sample data if needed (uncomment to use)
/*
INSERT INTO "vynce_user" (display_name, email, spotify_id, top_genre, share_card_count, plus_plan)
VALUES 
  ('John Doe', 'john@example.com', 'spotify123', 'Pop', 5, true),
  ('Jane Smith', 'jane@example.com', 'spotify456', 'Rock', 3, false),
  ('Bob Johnson', 'bob@example.com', 'spotify789', 'Hip Hop', 8, true);
*/

-- View recent users
SELECT id, display_name, email, top_genre, share_card_count, plus_plan
FROM "vynce_user"
ORDER BY created_at DESC
LIMIT 10; 