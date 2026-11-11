import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { CourseClassroom } from "@/components/course-classroom";
import { getLocalizeProduct } from "@/lib/localize-product-server";
import { getProductBySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.filter((p) => p.category === "curso").map((p) => ({ slug: p.slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = getProductBySlug(slug);
  if (!base || base.category !== "curso") notFound();
  const product = (await getLocalizeProduct())(base);

  return (
    <AuthGuard>
      <CourseClassroom slug={product.slug} title={product.title} description={product.longDescription} />
    </AuthGuard>
  );
}
