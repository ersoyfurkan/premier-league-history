import MatchCenter from "@/components/MatchCenter";

export default async function WorldCupMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchCenter comp="worldcup" id={id} />;
}
