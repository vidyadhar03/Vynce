-- Create Vynce_User table
CREATE TABLE IF NOT EXISTS Vynce_User (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    display_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    spotify_id VARCHAR(16),
    instagram_username TEXT,
    top_genre TEXT,
    average_daily_listens INTEGER DEFAULT 0,
    average_session_minutes INTEGER DEFAULT 0,
    share_card_count INTEGER DEFAULT 0,
    plus_plan BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE Vynce_User ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
    ON Vynce_User
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert"
    ON Vynce_User
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update own record"
    ON Vynce_User
    FOR UPDATE
    USING (auth.uid()::text = id::text); 