import MatchCenter from "@/components/MatchCenter";

export default async function CopaMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="copa" id={id} />;
}
