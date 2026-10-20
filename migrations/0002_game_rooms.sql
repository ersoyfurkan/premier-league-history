CREATE TABLE game_rooms (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_game_rooms_updated_at ON game_rooms(updated_at);
