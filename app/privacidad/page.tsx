import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LanguageNote } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal.privacy");
  return { title: t("metaTitle") };
}

const CONTACTO = "clubdevoleyplaya@gmail.com";

export default function PrivacidadPage() {
  const t = useTranslations("Legal.privacy");
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">{t("title")}</h1>
      <LanguageNote />
      <p className="mt-2 text-xs text-ink-soft">{t("draft")}</p>

      <div className="mt-8 space-y-8 text-sm text-ink-soft">
        <div>
          <h2 className="font-display text-base font-bold uppercase text-ink">{t("dataTitle")}</h2>
          <p className="mt-2">{t("dataBody")}</p>
        </div>

        <div>
          <h2 className="font-display text-base font-bold uppercase text-ink">{t("shareTitle")}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {(t.raw("share") as string[]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2">{t("noAi")}</p>
        </div>

        <div>
          <h2 className="font-display text-base font-bold uppercase text-ink">{t("deleteTitle")}</h2>
          <p className="mt-2">
            {t.rich("deleteBody", {
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
        </div>
      </div>
    </section>
  );
}
