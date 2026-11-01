import MatchCenter from "@/components/MatchCenter";

export default async function SerieAMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="seriea" id={id} />;
}
