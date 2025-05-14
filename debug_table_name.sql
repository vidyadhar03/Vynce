-- Check exact table names in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check for the specific Vynce_User table
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'Vynce_User';

-- Check table definition
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'Vynce_User';

-- Check if there is any data in the table
SELECT COUNT(*) FROM "Vynce_User";

-- View recent users from Vynce_User table
SELECT id, display_name, email, top_genre, share_card_count, plus_plan
FROM "Vynce_User"
ORDER BY created_at DESC
LIMIT 10; 