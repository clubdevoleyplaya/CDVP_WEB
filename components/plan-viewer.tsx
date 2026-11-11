"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthGuard } from "@/components/auth-guard";
import { useClauseSections } from "@/components/clausula-exencion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";

type Bloque = { titulo?: string; filas: (string | number | null)[][] };
type Semana = { titulo: string; bloques: Bloque[] };
type Plan = {
  slug: string;
  title: string;
  status: "disponible" | "proximamente";
  content?: { semanas: Semana[] };
};

type Estado =
  | { tipo: "cargando" }
  | { tipo: "clausula" }
  | { tipo: "plan"; plan: Plan }
  | { tipo: "sin-acceso" }
  | { tipo: "tope" }
  | { tipo: "no-existe" }
  | { tipo: "error" };

const API = process.env.NEXT_PUBLIC_API_URL;

export function PlanViewer({ slug }: { slug: string }) {
  const { session } = useDemoState();
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [aceptando, setAceptando] = useState(false);

  const cargar = useCallback(async () => {
    if (!session) return;
    setEstado({ tipo: "cargando" });
    try {
      const res = await fetch(`${API}/api/v1/planes/${slug}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) return setEstado({ tipo: "plan", plan: await res.json() });
      if (res.status === 409) return setEstado({ tipo: "clausula" });
      if (res.status === 403) return setEstado({ tipo: "sin-acceso" });
      if (res.status === 429) return setEstado({ tipo: "tope" });
      if (res.status === 404) return setEstado({ tipo: "no-existe" });
      setEstado({ tipo: "error" });
    } catch {
      setEstado({ tipo: "error" });
    }
  }, [session, slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  async function aceptar() {
    if (!session) return;
    setAceptando(true);
    try {
      const res = await fetch(`${API}/api/v1/planes/clausula`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error();
      await cargar();
    } catch {
      setEstado({ tipo: "error" });
    } finally {
      setAceptando(false);
    }
  }

  return (
    <AuthGuard>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Contenido estado={estado} onAceptar={aceptar} aceptando={aceptando} onReintentar={cargar} />
      </section>
    </AuthGuard>
  );
}

function Contenido({
  estado,
  onAceptar,
  aceptando,
  onReintentar,
}: {
  estado: Estado;
  onAceptar: () => void;
  aceptando: boolean;
  onReintentar: () => void;
}) {
  const t = useTranslations("PlanViewer");
  const clauseSections = useClauseSections();
  switch (estado.tipo) {
    case "cargando":
      return (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      );
    case "clausula":
      return (
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">
            {t("beforeOpen")}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {t("beforeOpenText")}
          </p>
          <div className="mt-6 max-h-96 space-y-6 overflow-y-auto rounded-xl border border-line p-5 text-sm text-ink-soft">
            {clauseSections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-sm font-bold uppercase text-ink">
                  {section.title}
                </h2>
                <div className="mt-2 space-y-2">{section.body}</div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={onAceptar}
            disabled={aceptando}
            className="mt-6 font-display text-xs font-bold uppercase tracking-wide"
          >
            {aceptando ? t("saving") : t("accept")}
          </Button>
        </div>
      );
    case "plan":
      return estado.plan.status === "proximamente" ? (
        <Mensaje titulo={estado.plan.title} texto={t("soon")} />
      ) : (
        <PlanTablas plan={estado.plan} />
      );
    case "sin-acceso":
      return (
        <Mensaje
          titulo={t("noAccessTitle")}
          texto={t("noAccessText")}
          enlace={{ href: "/suscripcion", texto: t("seeMembership") }}
        />
      );
    case "tope":
      return (
        <Mensaje
          titulo={t("limitTitle")}
          texto={t("limitText")}
        />
      );
    case "no-existe":
      return <Mensaje titulo={t("notFoundTitle")} texto={t("notFoundText")} />;
    case "error":
      return (
        <div>
          <Mensaje titulo={t("errorTitle")} texto={t("errorText")} />
          <Button type="button" variant="outline" onClick={onReintentar} className="mt-4">
            {t("retry")}
          </Button>
        </div>
      );
  }
}

function Mensaje({
  titulo,
  texto,
  enlace,
}: {
  titulo: string;
  texto: string;
  enlace?: { href: string; texto: string };
}) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">{titulo}</h1>
      <p className="mt-2 text-sm text-ink-soft">{texto}</p>
      {enlace && (
        <Link href={enlace.href} className="mt-3 inline-block text-sm font-bold underline">
          {enlace.texto}
        </Link>
      )}
    </div>
  );
}

function PlanTablas({ plan }: { plan: Plan }) {
  return (
    <div className="select-none">
      <h1 className="font-display text-2xl font-bold uppercase">{plan.title}</h1>
      <div className="mt-8 space-y-10">
        {plan.content?.semanas.map((semana) => (
          <div key={semana.titulo}>
            <h2 className="font-display text-lg font-bold uppercase">{semana.titulo}</h2>
            {semana.bloques.map((bloque, i) => (
              <div key={i} className="mt-4 overflow-x-auto">
                {bloque.titulo && (
                  <h3 className="mb-2 text-sm font-bold text-ink">{bloque.titulo}</h3>
                )}
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {bloque.filas.map((fila, r) => (
                      <tr key={r} className="border-b border-line">
                        {fila.map((celda, c) => (
                          <td key={c} className="px-2 py-1.5">
                            {celda}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
