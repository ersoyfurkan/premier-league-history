CREATE TABLE IF NOT EXISTS football_minesweeper_rooms (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_football_minesweeper_updated
  ON football_minesweeper_rooms(updated_at);
