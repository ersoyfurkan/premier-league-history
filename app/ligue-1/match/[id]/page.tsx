import MatchCenter from "@/components/MatchCenter";

export default async function Ligue1MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="ligue1" id={id} />;
}
