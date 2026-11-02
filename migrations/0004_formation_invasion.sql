CREATE TABLE IF NOT EXISTS formation_invasion_rooms (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_formation_invasion_rooms_updated_at
  ON formation_invasion_rooms(updated_at);
