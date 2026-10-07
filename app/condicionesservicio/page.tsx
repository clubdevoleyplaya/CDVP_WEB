import type { Metadata } from "next";
import { CLAUSULA_SECTIONS } from "@/components/clausula-exencion";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Condiciones de servicio — Club de Voley Playa",
};

export default function CondicionesServicioPage() {
  return (
    <LegalPage
      title="Condiciones de servicio y cláusula de exención de responsabilidad"
      sections={[
        {
          title: "Titular",
          body: (
            <p>
              Titular: Julian Azaad. Nombre comercial: Club de Voley Playa. Los
              pagos en dólares los procesa Paddle, que actúa como revendedor
              oficial (Merchant of Record) de los productos.
            </p>
          ),
        },
        ...CLAUSULA_SECTIONS,
      ]}
    />
  );
}
