import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal.refund");
  return { title: t("metaTitle") };
}

const CONTACTO = "clubdevoleyplaya@gmail.com";

export default function PoliticaReembolsoPage() {
  const t = useTranslations("Legal.refund");
  return (
    <LegalPage
      title={t("title")}
      draftNote={t("draft")}
      sections={[
        {
          title: t("howTitle"),
          body: (
            <p>
              {t.rich("howBody", {
                email: CONTACTO,
                mail: (chunks) => (
                  <a
                    href={`mailto:${CONTACTO}`}
                    className="font-bold text-ink underline underline-offset-2"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          ),
        },
        { title: t("digitalTitle"), body: <p>{t("digitalBody")}</p> },
        { title: t("membershipTitle"), body: <p>{t("membershipBody")}</p> },
        { title: t("usdTitle"), body: <p>{t("usdBody")}</p> },
        { title: t("termTitle"), body: <p>{t("termBody")}</p> },
      ]}
    />
  );
}
