import MatchCenter from "@/components/MatchCenter";

export default async function ChampionsLeagueMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="ucl" id={id} />;
}
