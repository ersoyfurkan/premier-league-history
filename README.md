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

- [Shared nation visuals](./data/nationVisuals.ts) provide national football team/association crests (not country flags) for tournament quiz answers, all-time stats, finals/hosts and rivalry cards, plus Trivia Path, Tic-Tac-Toe and player cards. Name aliases and nationality adjectives resolve to the same asset; historical teams retain their historical identity. Combined country cells show each nation's crest and preserve their original text. Unknown/non-nation cells are left as text. The [crest catalogue](./data/nationCrests.generated.json) records source pages; refresh it with `node scripts/refresh-nation-crests.mjs`. The refresh reports missing crests rather than substituting flags.

- Spaces show club badges, national team crests, competition/trophy imagery, player/manager portraits, and metric icons: a ball for goals, boot for assists, gloves for saves, and numeric threshold or title-count badges. Full question text appears only in the active-question panel.
- In local and online Trivia Path, completing a box reserves all answers used in that successful turn for that box, for both players. Reusing one (including an accepted alias) immediately loses the turn without moving. Answers from failed or timed-out attempts remain available; repeating an answer within the current attempt only prompts for another answer.
- Trivia Path search suggestions match the active answer type (players, nations, clubs, stadiums, managers, nicknames, campaigns or seasons), using a broad catalogue rather than revealing the box's correct answers.
- The final space shows a lock until the first landing, including an unsuccessful attempt. The reveal persists for the rest of the match and is shared by both online players. Before reveal, the room API sends no final-tile ID, question label, answers, or visual clues. A rematch resets the lock.
- Career answers include senior loan appearances. Divock Origi is accepted for Nottingham Forest and Lille as well as Liverpool and AC Milan. His Wolfsburg spell uses `wob`, not Wolverhampton's `wol` key. Name matching preserves word boundaries for unique surnames.
- Run `pnpm data:club-history` to refresh [the sourced senior-appearance supplement](./data/clubHistory.generated.json). Its `checkedAt`, per-club source URLs, coverage statements, and unavailable/unsupported sources are persisted. Only positive appearance rows are imported; merely signing for a club is not evidence of playing.
- **Coverage is not guaranteed exhaustive.** Many public player lists impose minimum appearance counts, and some clubs lack a compatible list. The supplement broadens the existing career union; it does not prove that every short loan, every historic player, or every authored trivia category has been captured. A successful refresh reports remaining source gaps explicitly rather than claiming completeness. Existing live and award snapshots retain their own update dates; dated historical questions retain their printed cutoffs rather than silently becoming live totals.

## Mobile layouts

Phone-specific layouts are scoped to `width < 768px` in [the shared styles](./app/globals.css); the existing laptop/desktop layout at 768px and above is unchanged. Mobile navigation accommodates device safe areas, forms use 16px inputs to avoid focus zoom, and controls have a 44px minimum touch height. Competition tabs swipe horizontally and wide tables retain every column in their own scroll region. Trivia Path answer panels stack on phones, Tic-Tac-Toe clues are larger, and Rondo puts the answer form below its letter ring so the keyboard does not crowd the question.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
