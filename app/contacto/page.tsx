import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { CONTACT } from "@/lib/menu";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  return { title: t("metaTitle") };
}

const LINK = "font-bold text-blue underline underline-offset-2";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const whatsapp = CONTACT.whatsapp?.replace(/\D/g, "");

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold uppercase">{t("title")}</h1>
      <p className="mt-3 text-base text-ink-soft">{t("intro")}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm">
        <div>
          <h2 className="font-display text-base font-bold uppercase">{t("emailTitle")}</h2>
          <a href={`mailto:${CONTACT.email}`} className={LINK}>
            {CONTACT.email}
          </a>
        </div>

        {whatsapp && (
          <div>
            <h2 className="font-display text-base font-bold uppercase">WhatsApp</h2>
            <a href={`https://wa.me/${whatsapp}`} className={LINK} rel="noopener noreferrer">
              {t("whatsappCta")}
            </a>
          </div>
        )}

        <div>
          <h2 className="font-display text-base font-bold uppercase">{t("socialTitle")}</h2>
          <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
            {CONTACT.socials.map((social) => (
              <li key={social.name}>
                <a href={social.href} className={LINK} rel="noopener noreferrer" target="_blank">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
