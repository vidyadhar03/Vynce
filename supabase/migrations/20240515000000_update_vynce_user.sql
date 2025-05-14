-- Remove public read policy to keep table private
DROP POLICY IF EXISTS "Allow public read access" ON "Vynce_User";

-- Add auth user relationship column if doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Vynce_User' AND column_name = 'auth_user_id'
    ) THEN
        -- Add auth_user_id column with foreign key to auth.users
        ALTER TABLE "Vynce_User" ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        -- Create a unique index on the auth_user_id column to enforce one-to-one relationship
        CREATE UNIQUE INDEX "Vynce_User_auth_user_id_unique" ON "Vynce_User" (auth_user_id);
    END IF;
END $$; 