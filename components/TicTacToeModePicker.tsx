"use client";

import type { FootballTicTacToeMode } from "@/lib/footballTicTacToe";

export default function TicTacToeModePicker({
  value, onChange, disabled = false,
}: {
  value: FootballTicTacToeMode;
  onChange: (mode: FootballTicTacToeMode) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="mt-4 space-y-2 text-left">
      <legend className="text-sm font-semibold">Choose the rules</legend>
      {([
        ["normal", "Normal", "Any matching, unused answer wins the square."],
        ["hidden-trap", "Hidden Trap", "One valid answer is randomly hidden in each square. Guess it and your opponent wins that square and gets the next turn."],
      ] as const).map(([mode, label, description]) => (
        <label key={mode} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${value === mode ? "border-primary bg-primary/10" : "border-border"}`}>
          <input type="radio" name="tic-tac-toe-mode" value={mode} checked={value === mode} onChange={() => onChange(mode)} className="mt-1" />
          <span><span className="block font-semibold">{label}</span><span className="mt-1 block text-xs text-fore-muted">{description}</span></span>
        </label>
      ))}
    </fieldset>
  );
}
