-- Insert sample data into Vynce_User table
INSERT INTO "Vynce_User" (
    display_name, 
    email, 
    spotify_id, 
    instagram_username, 
    top_genre, 
    average_daily_listens, 
    average_session_minutes, 
    share_card_count, 
    plus_plan
) VALUES 
('John Doe', 'john@example.com', 'spotify123', 'johndoe', 'Pop', 45, 120, 5, true),
('Jane Smith', 'jane@example.com', 'spotify456', 'janesmith', 'Rock', 30, 90, 3, false),
('Bob Johnson', 'bob@example.com', 'spotify789', 'bobjohnson', 'Hip Hop', 60, 150, 8, true),
('Alice Brown', 'alice@example.com', 'spotify101', 'alicebrown', 'Jazz', 25, 75, 2, false),
('Charlie Wilson', 'charlie@example.com', 'spotify102', 'charliew', 'Electronic', 50, 130, 6, true);

-- Check the inserted data
SELECT id, display_name, email, top_genre, share_card_count, plus_plan
FROM "Vynce_User"
ORDER BY created_at DESC
LIMIT 10; 