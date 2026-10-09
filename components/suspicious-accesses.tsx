"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";

type Account = {
  user_id: string;
  email: string | null;
  dispositivos: number;
  contenidos: number;
  ultimo_acceso: string;
};
type PaidYoutubeProduct = { slug: string; title: string; category: string };
type Report = {
  ventana_horas: number;
  cuentas_compartidas: Account[];
  extraccion: Account[];
  youtube_de_pago: PaidYoutubeProduct[];
};

const API = process.env.NEXT_PUBLIC_API_URL;

function AccountList({ accounts, empty }: { accounts: Account[]; empty: string }) {
  if (accounts.length === 0) return <p className="text-sm text-ink-soft">{empty}</p>;
  return (
    <ul className="grid gap-3">
      {accounts.map((account) => (
        <li key={account.user_id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{account.email ?? "Cuenta sin correo"}</CardTitle>
              <CardDescription>
                Último acceso: {new Date(account.ultimo_acceso).toLocaleString("es-AR")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              {account.dispositivos} dispositivos distintos · {account.contenidos} contenidos distintos
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function SuspiciousAccesses() {
  const { session } = useDemoState();
  const [report, setReport] = useState<Report | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`${API}/api/v1/admin/accesos-sospechosos`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setReport)
      .catch(() => setLoadError(true));
  }, [session]);

  if (loadError) {
    return <p className="text-sm text-destructive">No se pudo cargar la lista. Intenta de nuevo en un momento.</p>;
  }
  if (!report) return <Skeleton className="h-32 w-full max-w-3xl" />;

  return (
    <div className="grid max-w-3xl gap-10">
      <section>
        <h2 className="font-display text-lg font-bold uppercase">Posible cuenta compartida</h2>
        <p className="mb-3 mt-1 text-sm text-ink-soft">
          Cuentas vistas desde 3 o más dispositivos en las últimas {report.ventana_horas} horas.
        </p>
        <AccountList accounts={report.cuentas_compartidas} empty="Ninguna cuenta marcada." />
      </section>
      <section>
        <h2 className="font-display text-lg font-bold uppercase">Posible extracción</h2>
        <p className="mb-3 mt-1 text-sm text-ink-soft">
          Cuentas que abrieron 8 o más contenidos distintos en las últimas {report.ventana_horas} horas.
        </p>
        <AccountList accounts={report.extraccion} empty="Ninguna cuenta marcada." />
      </section>
      <section>
        <h2 className="font-display text-lg font-bold uppercase">Productos de pago en YouTube</h2>
        <p className="mb-3 mt-1 text-sm text-ink-soft">
          YouTube no impide descargar un video ni restringe dónde se muestra. Conviene pasar estos
          productos a Vimeo.
        </p>
        {report.youtube_de_pago.length === 0 ? (
          <p className="text-sm text-ink-soft">Ningún producto de pago usa YouTube.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {report.youtube_de_pago.map((product) => (
              <li key={product.slug}>
                <strong>{product.title}</strong> <span className="text-ink-soft">({product.category})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-xs text-ink-soft">
        Esta pantalla solo avisa: nadie queda bloqueado. Revisa cada caso a mano antes de actuar.
      </p>
    </div>
  );
}
