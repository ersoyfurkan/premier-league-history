This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Statistical Trivia Path and Rondo questions

[Season snapshots](./data/statTriviaSeasons.ts) and [historical records and combined challenges](./data/statTriviaRecords.ts) feed both games through [the shared statistical question bank](./data/statTrivia.ts). Each dataset or authored challenge includes source URLs and an explicit reference season or historical cutoff. These are curated historical facts, not live career totals.

- Domestic season questions use 2023/24; international snapshots use the 2022 men's World Cup finals, Euro 2024, and Copa America 2024.
- All seven competitions have scoring, goals-plus-assists, and goals-plus-title/award questions. General mode also includes international career milestones combined with World Cup, Champions League, and Ballon d'Or achievements.
- Additional verified topics include Bundesliga saves and duels, La Liga and Serie A penalty saves, and international tournament sendings-off and shootout saves. Shootout saves are explicitly distinguished from in-match penalty saves.
- Completed long passes and offsides are not included in this expansion: comparable, completed historical datasets were not verified. Do not infer them from total passes, pass accuracy, or shots.
- A dataset's `minimum` is its complete coverage boundary, including ties. Never generate lower-threshold questions from a top-scorer excerpt. Partial season archives must not be presented as completed-season totals. Assist questions preserve provider-specific definitions.
- Difficulty tiers prioritize multi-condition and specialist questions, then smaller accepted-answer pools. Normal Trivia Path tiles need **13 distinct accepted answers** (more than twelve); the final tile needs **at least six**. Small-answer categories remain available to Rondo but cannot appear on new Trivia Path boards. The final tile is reserved from the highest-rated eligible categories, and every preceding tile has a strictly lower rating. Solo and online games share this generator.
- Rondo additions preserve existing clue indices and allow different statistical questions about the same player.

Run the focused checks with `pnpm test:stat-games` (Node.js 22.15+). They cover source metadata, answer pools and aliases, statistical boundaries, Rondo integration, and the final-tile invariant across all competition modes.

### Stadiums, teammates, managers, and honours

[The shared football knowledge bank](./data/footballKnowledge.ts) supplies Trivia Path and Rondo with multi-club and multi-league careers, league-plus-club intersections, trophy/award combinations, and harder geographical questions. Egyptian internationals are distinct from players who actually appeared in Egypt's domestic league; Japan and South Africa also have domestic-football questions. These are curated historical answer banks with source links, not live/exhaustive career databases.

- Recent-honour questions explicitly use **2021-2025**, **2016-2025**, or **2020/21-2024/25**. These are frozen reference windows, not a rolling clock; update the wording and verified winners together. The Messi/Ronaldo exclusion applies to the ten-year Ballon d'Or question.
- Teammates come from specified senior club seasons, never from matching undated club histories. The named player cannot answer their own teammate question.
- Football Tic-Tac-Toe uses these same teammate and honour memberships. Managed-by categories now use familiar coaches and explicit club spells from **2010 onward**; Capello and the old all-time manager pools are removed. A manager clue is restricted to the club/season printed on it, not every player they ever coached.
- Tic-Tac-Toe samples compatible axes before building a grid, retaining the existing minimum of three answers per square (two if generation needs to relax). Domestic modes now admit global trophy and award categories too.
- [The stadium bank](./data/stadiumTrivia.ts) covers Brazil, Argentina, England, Spain, Germany, Italy, France, Portugal, and Egypt. Country questions use stadium nouns, while Rondo has club-home and national-venue clues, including **A: Liverpool's stadium → Anfield**. Historic/sponsor names are aliases of one venue, not extra answers.
- Additions are appended to Rondo to preserve saved clue indices. Trivia Path category IDs reconstruct in both solo and online games. The finish is the hardest **eligible** category, not a single-answer statistical riddle.

The same focused test command also checks stadium aliases/search, modern manager boundaries, teammate overlap/self-exclusion, trophy rosters, compound predicates, and playable generated Tic-Tac-Toe grids in every mode.

### Individual awards in all three games

[The shared award bank](./data/individualAwards.ts) uses [56 sourced men's award histories](./data/individualAwards.generated.json): Ballon d'Or, FIFA world-player/goalkeeper awards, Puskas, Golden Boy, Kopa, Yashin, European Golden Shoe, major top-five-league player/young-player/scorer/goalkeeper awards, Serie A positional awards, UEFA/Champions League awards, and World Cup, Euros and Copa America awards.

- Standalone awards are mixed randomly with award-pair, award-plus-club, and documented teammate/manager/honour questions. OR collections explicitly accept any listed award; AND questions require every condition. Tic-Tac-Toe also mixes award axes with existing compatible categories rather than producing unplayable intersections.
- Trivia Path retains **13 distinct answers on normal boxes and six on the final box**, with the hardest eligible question last and concealed until first reached. Awards with small winner pools remain available to Rondo and compatible Tic-Tac-Toe grids; clearly labelled OR collections can make them playable in Trivia Path without inventing winners.
- Award clues use award-specific images in Trivia Path and Tic-Tac-Toe, including existing stored award labels. Ballon d'Or, Puskas and PL Golden Boot have trophy photographs; the other awards use **original labelled illustrations**, not photographs of their actual trophies. Every photo has a local illustrated fallback in [the award assets](./public/awards/). Large OR collections show representative images and a count; the active question lists all eligible awards.
- The snapshot records its retrieval date, per-award source URL and winner-seasons; wording states its recorded-season cutoff. It is not a live feed or a guarantee of exhaustive career intersections. Official World Cup Golden Ball and Copa best-player histories are distinguished from retrospective lists; World Cup young-player questions explicitly include retrospective selections. Joint winners are retained, including Neymar alongside Messi in 2021 using CONMEBOL's own announcement; shortlists and runners-up are excluded. Golden Boot histories respect the edition's award tie-break rules, rather than automatically treating every equal scorer as an award winner.
- Refresh with `pnpm data:individual-awards`. After an interrupted run, `pnpm data:individual-awards --resume` continues the snapshot; `--resume --replace=ballon,puskas` refreshes selected histories. Review source-table mappings and run `pnpm test:stat-games` before using a refreshed snapshot.

### Trivia Path board clues and answer coverage

- New boards use each named team only once across all 16 spaces, including the hidden finish. Single-team, two-team, nationality, manager/teammate and award-combination clues share the same club/national-team identities used for their visuals. Both clubs in a paired clue are reserved; generic competition logos do not count as teams. Selection retains answer-pool minimums, ascending difficulty and the hardest finish. Team identities are prepared offline with `pnpm data:quiz`; saved boards keep their original tiles.

- [Shared nation visuals](./data/nationVisuals.ts) provide national football team/association crests (not country flags) for tournament quiz answers, all-time stats, finals/hosts and rivalry cards, plus Trivia Path, Tic-Tac-Toe and player cards. Name aliases and nationality adjectives resolve to the same asset; historical teams retain their historical identity. Combined country cells show each nation's crest and preserve their original text. Unknown/non-nation cells are left as text. The [crest catalogue](./data/nationCrests.generated.json) records source pages; refresh it with `node scripts/refresh-nation-crests.mjs`. The refresh reports missing crests rather than substituting flags.

- Spaces show club badges, national team crests, competition/trophy imagery, player/manager portraits, and metric icons: a ball for goals, boot for assists, gloves for saves, and numeric threshold or title-count badges. Full question text appears only in the active-question panel.
- In local and online Trivia Path, completing a box reserves all answers used in that successful turn for that box, for both players. Reusing one (including an accepted alias) immediately loses the turn (without moving on an ordinary turn; with the backward penalty on a skull turn). Answers from failed or timed-out attempts remain available; repeating an answer within the current attempt only prompts for another answer.
- The first dice roll has seven equally likely outcomes: 1-6 or a skull. A skull requires a second, numeric-only roll. Success advances normally; any turn-ending failure (wrong/reused answer or timeout) moves the player back by that number **from the turn's starting position**, clamped at start. This backward journey clears both players' used-answer reservations on every box from the attempted question back through the destination, inclusive. Other boxes stay reserved. Online skull rerolls retain the same player and have their own 30-second auto-roll timer; the skull resets on the next turn/rematch.
- Trivia Path search suggestions match the active answer type (players, nations, clubs, stadiums, managers, nicknames, campaigns or seasons), using a broad catalogue rather than revealing the box's correct answers.
- The final space shows a lock until the first landing, including an unsuccessful attempt. The reveal persists for the rest of the match and is shared by both online players. Before reveal, the room API sends no final-tile ID, question label, answers, or visual clues. A rematch resets the lock.
- Career answers include senior loan appearances. Divock Origi is accepted for Nottingham Forest and Lille as well as Liverpool and AC Milan. His Wolfsburg spell uses `wob`, not Wolverhampton's `wol` key. Name matching preserves word boundaries for unique surnames.
- Run `pnpm data:club-history` to refresh [the sourced senior-appearance supplement](./data/clubHistory.generated.json). Its `checkedAt`, per-club source URLs, coverage statements, and unavailable/unsupported sources are persisted. Only positive appearance rows are imported; merely signing for a club is not evidence of playing.
- **Coverage is not guaranteed exhaustive.** Many public player lists impose minimum appearance counts, and some clubs lack a compatible list. The supplement broadens the existing career union; it does not prove that every short loan, every historic player, or every authored trivia category has been captured. A successful refresh reports remaining source gaps explicitly rather than claiming completeness. Existing live and award snapshots retain their own update dates; dated historical questions retain their printed cutoffs rather than silently becoming live totals.

## Mobile layouts

Click **Tik Tak Toe** in any competition lobby or General to open its setup screen, then choose **Normal** or **Hidden Trap** and either invite a friend or play on the same device. Existing invite links open their room directly without asking the joining player to choose rules.

Phone-specific layouts are scoped to `width < 768px` in [the shared styles](./app/globals.css); the existing laptop/desktop layout at 768px and above is unchanged. Mobile navigation accommodates device safe areas, forms use 16px inputs to avoid focus zoom, and controls have a 44px minimum touch height. Competition tabs swipe horizontally and wide tables retain every column in their own scroll region. Trivia Path answer panels stack on phones, Tic-Tac-Toe clues are larger, and Rondo puts the answer form below its letter ring so the keyboard does not crowd the question.

### Short, mixed-difficulty Rondo rounds

Every new A-Z round has **9 easy, 9 medium and 8 hard** clues in all competition modes, shared by solo, same-device and online play. New rounds select identifying clues with **one intended answer**, retaining accepted spellings and aliases. Open-ended award collections and multi-player-per-letter categories are not eligible. Award questions specify the award and winning year/season; specialist historical winners and exact statistical records supply harder questions. No question text repeats within a round, and the preceding round's pick is avoided wherever another eligible question exists.

New prompts allow up to **180 characters** for specific facts, with balanced wrapping and smaller text for longer clues, rather than truncating away identifying information. Difficulty stays internal: no difficulty badges or "Name a winner/player:" prefixes appear on the board. For example, "Player who won the PL Golden Boot in 2022–23" identifies Erling Haaland rather than accepting any Golden Boot winner. Full question scope remains available where it differs from the displayed prompt. Feedback labels the answered letter to avoid confusing the previous answer with the next question.

The [specific Turkish-football bank](./data/rondoSuperligSpecific.ts) replaces generic Süper Lig placeholder selections with 52 identifying clues; it does not borrow international fallback questions. Existing bank entries, canonical clue order and saved multiplayer picks remain intact, so older games are not changed midway. New dated award clues are prepared offline in the award snapshot, not recomputed in each Worker.

### Formation Invasion

Available from every competition lobby and General. Choose **online invite**, **two players on the same device**, or **solo practice**. A randomized, position-correct 4-3-3 uses eleven distinct, well-known footballers active this century. The [curated bank](./data/formationInvasion.ts), [additional career questions](./data/formationInvasionQuestions.ts) and [tiered expansion](./data/formationInvasionExpansion.ts) provide **1,062 original questions for 59 footballers: 18 each, six per difficulty tier**, with biography sources, explicit answer aliases and a clue per question. Topics include transfers, teammates, managers, shirt numbers, trophies and memorable matches. Players belong to the selected competition through senior appearances (international finals appearances for tournament modes); the questions can cover their wider careers. This is a finite historical bank, not live player statistics or an AI-generated feed.

Each new game selects **one easy, one medium and one hard question per footballer**, in that order, and persists their indices. Those selections stay fixed through mistakes, turn changes, clue votes, polling and room reloads. New games select again; random selections may naturally repeat. Existing saved rooms retain their saved indices; rooms without question picks continue using the original first three questions. Original question order is append-only for compatibility. Only the active question and mutually approved clue are sent in an online view, never the chosen indices or future questions. These are independently authored questions, not transcriptions of Front Three videos.

- Progress is shared: a correct answer advances that footballer's question and retains the turn. The player can continue or choose a different unlocked footballer.
- Wrong answers pass the turn without resetting progress or revealing the answer. The opponent can continue that question or choose someone else; passing voluntarily is also supported.
- Whoever answers **question 3** claims the footballer permanently, regardless of who answered questions 1 and 2. First to **own six** wins; claimed players cannot be stolen.
- Every question has **three progressively stronger clues**, revealed one at a time only after both players approve that particular clue. In multiplayer each reveal starts a **shared-clue race**: either side can answer regardless of the previous turn, with one attempt each. First correct answer advances progress and takes the next turn; only question 3 claims the footballer. A wrong race answer locks that side out until the other side answers. If both are wrong, normal turns resume with the original turn-holder, retaining revealed clues and allowing votes for the next clue. Switching footballers and passing are disabled while a race is unresolved. Same-device races show a separately labelled answer form for each player. Clues and all votes reset when that question is completed.
- After **all three clues** are revealed, both players can vote for **Last Man Standing** on that current question, including while its final clue race is open. It never starts automatically. A random player starts a basic football category from [the historical category bank](./data/formationStanding.ts). Players alternate different answers with **7,000 milliseconds per turn**; the first wrong or repeated answer, including an alias of a used answer, or a timeout loses. The winner completes **only the current question** and keeps the turn; question 3 still claims the footballer and a sixth claim still wins the match. If all answers in a category are used, a new category starts with an empty used-answer list and the next player's seven-second turn.
- Last Man Standing locks other formation actions until it ends. Online deadlines use server time and conditional D1 writes; both authenticated polling and submissions settle expired rounds exactly once, including after reconnects. A late submission cannot answer the next formation question. Local play uses the same rules and checks deadlines on a 100ms UI tick; solo has three immediate one-at-a-time clues but no two-player tiebreaker. The browser only receives the category prompt and already-used answers, not its eligible answer list.
- Solo practice has no opponent: claim six, track correct answers and mistakes, and reveal clues immediately. Multiplayer new games require both votes after the match; solo can restart immediately.
- The game screen has no expandable player-photo credit list. A small **Image licences** link opens the [separate attribution page](./app/game/formation-invasion/credits/page.tsx), which retains primary and fallback image sources, creator/licence references and the display-crop notice.
- Online rooms store private tokens in browser storage, check answers server-side, omit answers/future questions/unapproved clues from room responses, and reject outdated or duplicate actions with revision-checked writes. Race winners are determined by the first correct answer committed by the server, not client clocks. An in-flight race answer may survive the other player's wrong attempt only for that same unresolved question; a bounded conditional-write retry preserves both simultaneous attempts without advancing twice. Local practice necessarily includes the question bank in the browser; it is not an anti-cheat system.
- [The D1 schema](./migrations/0004_formation_invasion.sql) is idempotent. The deployment workflow prepares this table before publishing. For manual deployment, run `pnpm exec wrangler d1 execute DB --remote --file migrations/0004_formation_invasion.sql --yes` before publishing. Ordinary `next dev` supports local/solo; online needs the Workers D1 binding.

Run `pnpm test:formation` for lineup, answer-alias, shared-progress, turn, clue, victory, rematch and real-route concurrency tests. These are also included in `pnpm test:stat-games`; the route tests substitute an in-memory D1 implementation and do not touch production.

### Tic-Tac-Toe rules

The creator chooses **Normal** or **Hidden Trap** before inviting a friend; same-device games also have a pregame rules screen. Normal preserves existing rules. Hidden Trap automatically picks one random valid answer per square, without calling an AI service. Guessing that hidden answer gives the square to the opponent and passes the turn to them; all other valid, unused answers work normally. Trap awards can complete a win or draw.

Same-device answers belong to the player and turn that selected the square. If that turn expires before submission, the pending answer cannot be submitted on behalf of the next player; select the square again. Trap notices identify who hit the trap as well as who receives the square.

Award headers show larger images and each award's name, never a hidden "+N" count. New grids exclude OR award collections: an award header names one specific award or requires all awards in a combination. Multi-award headers scroll within the box. Awards intersect with compatible nation, club, documented manager-spell and teammate-spell clues. A player must meet both axes; every square still has at least two valid answers. Existing saved boards keep their original conditions until both players start a new game.

Online picks remain private in the stored room state, and public room views omit unrevealed picks and answer pools. After each valid move, the completed square displays **AI pick**, whether the submitted answer matched it or not. Invalid guesses do not reveal picks; empty squares stay hidden. Same-device picks live in browser memory, hidden from the game UI rather than protected from developer tools. During or after play, each player can vote for a new game; only both votes together reset the board, preserving the rules and generating a fresh grid and picks. Same-device play has separate Player 1 and Player 2 vote buttons. Older rooms without a mode keep Normal rules.

### Club Duel guesses

Each player gets **one guess per round**. A wrong or already-used player consumes that guess; the opponent can still answer. Two wrong guesses give zero points each. The first correct guess accepted by the server wins the round's single point, with optimistic version retries preventing simultaneous correct requests from scoring twice. Skipping gives up that player's guess; if neither player can answer, the round ends with no points. The existing timer and first-to-five match target remain unchanged.

## Cloudflare resource limits

`pnpm build` runs `pnpm data:quiz` before compiling Next.js. The [quiz preparation script](./scripts/prepare-quiz-data.mjs) computes award combinations, the shared career/fact universe, Tic-Tac-Toe clue memberships, and Trivia Path tiles/candidate ratings offline. Generated quiz snapshots are committed; after changing source facts, awards, careers or categories, regenerate them with `pnpm data:quiz`. `pnpm test:stat-games` rejects stale snapshots.

Runtime games still choose random boards. Tic-Tac-Toe intersects prepared memberships rather than scanning every player's history for every clue. Trivia Path samples the complete prepared category catalogue, rather than a small random subset rebuilt in each Worker; its answer-count, difficulty and concealed-final rules are unchanged. Rondo's letter index preserves clue order and saved picks.

[OpenNext configuration](./open-next.config.ts) uses the read-only Static Assets incremental cache with cache interception, so prerendered pages do not rerender on every request. It does not provide persistent fetch caching or ISR; live feeds retain their existing freshness behavior. Private multiplayer APIs remain `no-store` and room state stays in D1.

Error 1102 means the Worker exhausted a resource budget. External I/O waits do not count as CPU, but parsing, normalization, puzzle construction and rendering do. These changes remove deterministic request-time work; they do not increase the Free plan's CPU allowance. Local timings are not proof of production CPU usage: verify the deployed Worker with Workers Logs, including cold game-page loads and online create/join/play/rematch requests. Do not reduce password-hashing strength or cache authentication/private room responses to fit the budget.

### Production deployment

[The deployment workflow](./.github/workflows/deploy.yml) builds on Linux and deploys pushes to `main`; it can also be started manually in GitHub Actions. This avoids Windows directory-link errors in Next.js/OpenNext's standalone output.

Add these **repository Actions secrets** in GitHub Settings > Secrets and variables > Actions:

- `CLOUDFLARE_API_TOKEN`: a Cloudflare token authorized to deploy Workers and upload assets to this account.
- `CLOUDFLARE_ACCOUNT_ID`: the account that owns the existing Worker and D1 binding.

Existing Worker secrets (such as `JWT_SECRET` and admin credentials) stay in Cloudflare; do not copy them into the workflow. Deployment uses `--keep-vars` to preserve dashboard variables. Missing deployment credentials fail explicitly before building.

The workflow prepares fresh quiz snapshots, runs regression checks, builds, deploys, and [checks the game page URLs](./scripts/check-deployed-games.mjs). These HTTP smoke checks detect 1102/503 failures but do not replace browser interaction and multiplayer API validation. Run them manually with `node scripts/check-deployed-games.mjs` (optionally followed by a different deployment origin).

Pushing code alone does not update the live site until this workflow completes successfully. The scheduled data-refresh workflow uses GitHub's built-in token, so its commits do not trigger another workflow; run deployment manually to publish those refreshes, or include them with the next normal push.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
