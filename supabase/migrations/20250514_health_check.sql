-- Create a simple health_check table for system status monitoring
CREATE TABLE IF NOT EXISTS health_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'ok',
  message TEXT
);

-- Insert a default record
INSERT INTO health_check (status, message)
VALUES ('ok', 'System health check table initialized')
ON CONFLICT DO NOTHING; 