import CardDetailComponent from "@/components/card/CardDetail";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const userId = String(resolvedParams.id);

  return <CardDetailComponent userId={userId} />;
}
