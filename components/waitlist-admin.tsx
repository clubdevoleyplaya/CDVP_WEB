"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";

type Entry = { email: string; locale: string; created_at: string; slug: string | null; title: string | null };

const API = process.env.NEXT_PUBLIC_API_URL;

export function WaitlistAdmin() {
  const { session } = useDemoState();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`${API}/api/v1/admin/lista-espera`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setEntries(data.entradas))
      .catch(() => setLoadError(true));
  }, [session]);

  if (loadError) return <p className="text-sm text-destructive">No se pudo cargar la lista.</p>;
  if (!entries) return <Skeleton className="h-24 w-full max-w-3xl" />;
  if (entries.length === 0) return <p className="text-sm text-ink-soft">Todavía no hay nadie anotado.</p>;

  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-sm text-ink-soft">{entries.length} anotados</p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left font-display text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Curso</th>
            <th className="py-2 pr-4">Idioma</th>
            <th className="py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.slug}-${entry.email}`} className="border-b border-line">
              <td className="py-2 pr-4">{entry.email}</td>
              <td className="py-2 pr-4">{entry.title}</td>
              <td className="py-2 pr-4 uppercase">{entry.locale}</td>
              <td className="py-2">{new Date(entry.created_at).toLocaleDateString("es-AR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
