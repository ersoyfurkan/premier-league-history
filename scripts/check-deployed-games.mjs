const origin = process.argv[2] ?? "https://premier-league-history.ersoyfurkan.workers.dev";
const paths = [
  "/game/general",
  "/champions-league/game?mode=league",
  "/game/rondo?comp=general",
  "/game/rondo?comp=ucl",
  "/game/trivia-path?comp=general",
  "/game/trivia-path?comp=ucl",
  "/game/football-tic-tac-toe?local=1&comp=general",
  "/game/football-tic-tac-toe?local=1&comp=ucl",
  "/game/club-duel?comp=general",
  "/game/club-duel?comp=ucl",
  "/game/formation-invasion?comp=general",
  "/game/formation-invasion?comp=worldcup",
  "/game/formation-invasion?comp=euros",
  "/game/formation-invasion?comp=copa",
  "/game/football-battleship?comp=general",
  "/game/football-battleship?comp=worldcup",
  "/game/football-battleship?comp=ucl",
];

const results = await Promise.allSettled(paths.map(async (path) => {
  const url = new URL(path, origin);
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const body = await response.text();
  const ok = response.ok && response.headers.get("content-type")?.includes("text/html")
    && body.includes("Football History Archive") && !body.includes("Worker exceeded resource limits");
  console.log(`${ok ? "PASS" : "FAIL"} ${path}: HTTP ${response.status}`);
  return ok;
}));

for (const [index, result] of results.entries()) {
  if (result.status === "rejected") console.error(`FAIL ${paths[index]}:`, result.reason);
}
if (results.some((result) => result.status === "rejected" || !result.value)) {
  throw new Error("Deployed game-route checks failed. Inspect Workers Logs.");
}
