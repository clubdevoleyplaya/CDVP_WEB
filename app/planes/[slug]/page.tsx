import { PlanViewer } from "@/components/plan-viewer";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PlanViewer slug={slug} />;
}
