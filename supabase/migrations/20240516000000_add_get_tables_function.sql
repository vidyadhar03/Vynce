-- Create a function to get all tables in the public schema
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS TABLE (
  table_name text,
  table_schema text,
  has_rows boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    t.table_schema::text,
    EXISTS(
      SELECT 1 FROM pg_stat_user_tables 
      WHERE schemaname = t.table_schema 
      AND relname = t.table_name 
      AND n_live_tup > 0
    ) AS has_rows
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name;
END;
$$; 