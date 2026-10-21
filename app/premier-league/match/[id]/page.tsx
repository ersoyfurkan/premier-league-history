import MatchCenter from "@/components/MatchCenter";

export default async function PremierLeagueMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="pl" id={id} />;
}
