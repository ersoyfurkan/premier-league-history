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
- Difficulty tiers prioritize multi-condition and specialist questions, then smaller accepted-answer pools. The final Trivia Path tile is reserved from the highest-rated eligible categories, and every preceding tile has a strictly lower rating. Solo and online games share this generator.
- Rondo additions preserve existing clue indices and allow different statistical questions about the same player.

Run the focused checks with `pnpm test:stat-games` (Node.js 22.15+). They cover source metadata, answer pools and aliases, statistical boundaries, Rondo integration, and the final-tile invariant across all competition modes.

### Stadiums, teammates, managers, and honours

[The shared football knowledge bank](./data/footballKnowledge.ts) supplies Trivia Path and Rondo with multi-club and multi-league careers, league-plus-club intersections, trophy/award combinations, and harder geographical questions. Egyptian internationals are distinct from players who actually appeared in Egypt's domestic league; Japan and South Africa also have domestic-football questions. These are curated historical answer banks with source links, not live/exhaustive career databases.

- Recent-honour questions explicitly use **2021-2025**, **2016-2025**, or **2020/21-2024/25**. These are frozen reference windows, not a rolling clock; update the wording and verified winners together. The Messi/Ronaldo exclusion applies to the ten-year Ballon d'Or question.
- Teammates come from specified senior club seasons, never from matching undated club histories. The named player cannot answer their own teammate question.
- Football Tic-Tac-Toe uses these same teammate and honour memberships. Managed-by categories now use familiar coaches and explicit club spells from **2010 onward**; Capello and the old all-time manager pools are removed. A manager clue is restricted to the club/season printed on it, not every player they ever coached.
- Tic-Tac-Toe samples compatible axes before building a grid, retaining the existing minimum of three answers per square (two if generation needs to relax). Domestic modes now admit global trophy and award categories too.
- [The stadium bank](./data/stadiumTrivia.ts) covers Brazil, Argentina, England, Spain, Germany, Italy, France, Portugal, and Egypt. Country questions use stadium nouns, while Rondo has club-home and national-venue clues, including **A: Liverpool's stadium → Anfield**. Historic/sponsor names are aliases of one venue, not extra answers.
- Additions are appended to Rondo to preserve saved clue indices. Trivia Path category IDs reconstruct in both solo and online games, and the highest-rated statistical finish remains strictly harder than earlier tiles.

The same focused test command also checks stadium aliases/search, modern manager boundaries, teammate overlap/self-exclusion, trophy rosters, compound predicates, and playable generated Tic-Tac-Toe grids in every mode.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
