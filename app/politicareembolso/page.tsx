import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Política de reembolso — Club de Voley Playa" };

const CONTACTO = "clubdevoleyplaya@gmail.com";

export default function PoliticaReembolsoPage() {
  return (
    <LegalPage
      title="Política de reembolso"
      draftNote="Borrador — el plazo de reembolso está pendiente de confirmar por Club de Voley Playa."
      sections={[
        {
          title: "Cómo pedir un reembolso",
          body: (
            <p>
              Escríbenos a{" "}
              <a
                href={`mailto:${CONTACTO}`}
                className="font-bold text-ink underline underline-offset-2"
              >
                {CONTACTO}
              </a>{" "}
              desde el mismo correo con el que hiciste la compra, indicando qué compraste y el motivo
              del pedido. Te respondemos por el mismo medio.
            </p>
          ),
        },
        {
          title: "Productos digitales",
          body: (
            <p>
              Los cursos, planes y guías son contenido digital de acceso inmediato. Cada pedido de
              reembolso se revisa según el plazo indicado más abajo y el uso que se haya hecho del
              contenido.
            </p>
          ),
        },
        {
          title: "Membresía",
          body: (
            <p>
              Puedes cancelar la membresía cuando quieras desde tu perfil. Conservas el acceso
              mientras el período pagado esté vigente y no se cobran períodos nuevos.
            </p>
          ),
        },
        {
          title: "Pagos en dólares",
          body: (
            <p>
              Los pagos en dólares los procesa Paddle como revendedor oficial (Merchant of Record).
              El reembolso, cuando corresponde, se devuelve al mismo medio de pago.
            </p>
          ),
        },
        {
          title: "Plazo",
          body: <p>Plazo de reembolso: por confirmar.</p>,
        },
      ]}
    />
  );
}
