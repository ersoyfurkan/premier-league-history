import "./register-data.mjs";
import { readFileSync, writeFileSync } from "node:fs";

const check = process.argv.includes("--check");
const output = (name, data) => {
  const json = `${JSON.stringify(data)}\n`;
  const path = new URL(`../data/${name}.generated.json`, import.meta.url);
  if (check) {
    if (readFileSync(path, "utf8") !== json) throw new Error(`${name} is stale. Run pnpm data:quiz.`);
  } else writeFileSync(path, json);
  console.log(`${name}: ${(Buffer.byteLength(json) / 1024).toFixed(0)} KiB`);
};

const awards = await import("./builders/individualAwards.ts");
output("quizAwards", { checkedAt: awards.AWARDS_CHECKED_AT, awards: awards.INDIVIDUAL_AWARDS, groups: awards.AWARD_GROUPS });
const football = await import("./builders/footballTicTacToe.ts");
output("quizFootball", football.prepareFootballTicTacToe());
const trivia = await import("../data/triviaPath.ts");
output("quizTrivia", trivia.prepareTriviaData());
