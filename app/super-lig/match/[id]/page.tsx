import MatchCenter from "@/components/MatchCenter";

export default async function SuperLigMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="superlig" id={id} />;
}
