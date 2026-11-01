CREATE TABLE football_tic_tac_toe_rooms (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_football_tic_tac_toe_rooms_updated_at
  ON football_tic_tac_toe_rooms(updated_at);
