import MatchCenter from "@/components/MatchCenter";

export default async function BundesligaMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="bundesliga" id={id} />;
}
