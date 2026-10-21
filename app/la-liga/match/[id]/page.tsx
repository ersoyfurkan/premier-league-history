import MatchCenter from "@/components/MatchCenter";

export default async function LaLigaMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="laliga" id={id} />;
}
