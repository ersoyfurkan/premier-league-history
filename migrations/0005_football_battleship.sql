CREATE TABLE IF NOT EXISTS football_battleship_rooms (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_football_battleship_updated
  ON football_battleship_rooms(updated_at);
