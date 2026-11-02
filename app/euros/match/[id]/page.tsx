import MatchCenter from "@/components/MatchCenter";

export default async function EurosMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="euros" id={id} />;
}
