-- Supabase Schema for viralme.lol

-- 1. Bids Table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  base_amount NUMERIC NOT NULL DEFAULT 0,
  boost_total NUMERIC NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  held_top_since TIMESTAMPTZ,
  hall_of_fame BOOLEAN NOT NULL DEFAULT FALSE,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_session_id TEXT
);

CREATE INDEX idx_bids_identity ON bids(identity);
CREATE INDEX idx_bids_stripe_session_id ON bids(stripe_session_id);
CREATE INDEX idx_bids_paid_amount ON bids(paid, amount DESC);

-- 2. Takeover Table
-- Only holds one row (singleton)
CREATE TABLE takeover (
  id INTEGER PRIMARY KEY DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  identity TEXT NOT NULL,
  title TEXT NOT NULL,
  ends_at TIMESTAMPTZ,
  triggered_at TIMESTAMPTZ,
  trigger_amount NUMERIC NOT NULL DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize the takeover row
INSERT INTO takeover (id, active, identity, title, trigger_amount)
VALUES (1, false, '', '', 0)
ON CONFLICT (id) DO NOTHING;

-- 3. Settings Table
-- Only holds one row (singleton)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  takeover_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  takeover_duration_hours INTEGER NOT NULL DEFAULT 3,
  takeover_multiplier NUMERIC NOT NULL DEFAULT 5,
  CONSTRAINT single_row_settings CHECK (id = 1)
);

-- Initialize the settings row
INSERT INTO settings (id, takeover_enabled, takeover_duration_hours, takeover_multiplier)
VALUES (1, true, 3, 5)
ON CONFLICT (id) DO NOTHING;
