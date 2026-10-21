const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Premier League kickoffs arrive as local UK time, "YYYY-MM-DD HH:mm:ss"; format them as "24 Oct, 15:00"
export function fmtPlKickoff(raw?: string): string {
  const m = raw?.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return "TBC";
  return `${m[3]} ${MONTHS[Number(m[2]) - 1]}, ${m[4]}:${m[5]}`;
}

export function fmtUclKickoff(iso?: string): string {
  if (!iso) return "TBC";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
