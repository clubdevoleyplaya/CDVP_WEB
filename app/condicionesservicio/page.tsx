import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { useClauseSections } from "@/components/clausula-exencion";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal.terms");
  return { title: t("metaTitle") };
}

export default function CondicionesServicioPage() {
  const t = useTranslations("Legal");
  const clauseSections = useClauseSections();
  return (
    <LegalPage
      title={t("clauseHeading")}
      sections={[
        { title: t("terms.ownerTitle"), body: <p>{t("terms.ownerBody")}</p> },
        ...clauseSections,
      ]}
    />
  );
}
