import { useTranslations } from "next-intl";

import type { LegalSection } from "@/components/legal-page";

// Texto de la cláusula de exención de responsabilidad entregado por Juli (2026-09-29).
// Vive en messages/{es,en,pt}.json (namespace `Clause`); el español es el que rige y el que
// aceptan los usuarios. Se usa en /condicionesservicio y en el aviso que se acepta antes de abrir
// un plan. Si cambia el texto en español, hay que cambiar también CLAUSE_VERSION en CDVP_Api
// (app/services/plans_service.py) para pedirle a todos que la acepten de nuevo.
const CLAUSE_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"] as const;

export function useClauseSections(): LegalSection[] {
  const t = useTranslations("Clause");
  return CLAUSE_IDS.map((id) => ({
    title: t(`${id}.title`),
    body: (
      <>
        {(t.raw(`${id}.p`) as string[]).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </>
    ),
  }));
}
