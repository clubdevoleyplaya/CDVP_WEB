import { useTranslations } from "next-intl";

import { publicErrorCode } from "@/lib/user-errors";

// Texto para la persona a partir de la respuesta del API: el `code` conocido se traduce al idioma
// elegido; si no hay, se usa el texto propio de la pantalla (`fallback`).
export function useApiErrorMessage(): (status: number, body: unknown, fallback: string) => string {
  const t = useTranslations("ApiErrors");
  return (status, body, fallback) => {
    const code = publicErrorCode(status, body);
    return code ? t(code) : fallback;
  };
}
