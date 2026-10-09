"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";

type Row = {
  slug: string;
  title: string;
  price_usd: number | string;
  compare_usd: number | string | null;
  price_eur: number | string | null;
  compare_eur: number | string | null;
  price_eur_reviewed: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL;

function parse(text: string): number | null {
  const clean = text.trim().replace(",", ".");
  if (clean === "") return null;
  const value = Number(clean);
  return Number.isFinite(value) ? value : NaN;
}

function PriceRow({ row, onSaved }: { row: Row; onSaved: (row: Row) => void }) {
  const { session } = useDemoState();
  const [price, setPrice] = useState(row.price_eur == null ? "" : String(Number(row.price_eur)));
  const [compare, setCompare] = useState(row.compare_eur == null ? "" : String(Number(row.compare_eur)));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const priceValue = parse(price);
  const compareValue = parse(compare);
  const valid =
    priceValue !== null &&
    !Number.isNaN(priceValue) &&
    priceValue >= 0 &&
    !Number.isNaN(compareValue) &&
    (compareValue === null || compareValue > priceValue);

  async function save(reviewed: boolean) {
    if (!session || !valid || priceValue === null) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/precios-eur/${row.slug}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ price_eur: priceValue, compare_eur: compareValue, reviewed }),
      });
      if (res.status === 422) {
        setMessage({ kind: "error", text: "Revisa los valores: el tachado debe ser mayor al precio." });
        return;
      }
      if (!res.ok) throw new Error();
      onSaved(await res.json());
      setMessage({ kind: "ok", text: reviewed ? "Revisado" : "Guardado sin revisar" });
    } catch {
      setMessage({ kind: "error", text: "No se pudo guardar. Probá de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{row.title}</CardTitle>
        <CardDescription>
          USD {Number(row.price_usd)}
          {row.compare_usd != null ? ` (tachado ${Number(row.compare_usd)})` : ""} ·{" "}
          {row.price_eur_reviewed ? (
            <span className="text-green">Revisado</span>
          ) : (
            <span className="text-yellow">Pendiente de revisión</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs text-ink-soft">
          Precio EUR
          <Input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className="w-28" />
        </label>
        <label className="grid gap-1 text-xs text-ink-soft">
          Tachado EUR (opcional)
          <Input value={compare} onChange={(e) => setCompare(e.target.value)} inputMode="decimal" className="w-28" />
        </label>
        <Button type="button" onClick={() => save(true)} disabled={saving || !valid}>
          Aprobar precio
        </Button>
        <Button type="button" variant="outline" onClick={() => save(false)} disabled={saving || !valid}>
          Guardar sin aprobar
        </Button>
        {message && (
          <span role={message.kind === "error" ? "alert" : "status"} className={message.kind === "ok" ? "text-sm text-green" : "text-sm text-destructive"}>
            {message.text}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export function EurPricesEditor() {
  const { session } = useDemoState();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`${API}/api/v1/admin/precios-eur`, { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setRows(data.productos))
      .catch(() => setLoadError(true));
  }, [session]);

  if (loadError) return <p className="text-sm text-destructive">No se pudo cargar la lista. Intenta de nuevo en un momento.</p>;
  if (!rows) return <Skeleton className="h-32 w-full max-w-3xl" />;

  const pending = rows.filter((r) => !r.price_eur_reviewed).length;
  const unset = rows.filter((r) => r.price_eur == null).length;

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm">
        {pending === 0
          ? "Todos los precios están aprobados: el euro ya se ofrece en la web."
          : `Faltan aprobar ${pending} de ${rows.length} precios${unset > 0 ? ` (${unset} sin valor cargado)` : ""}. El euro no se ofrece en la web hasta aprobarlos todos.`}
      </p>
      {rows.map((row) => (
        <PriceRow
          key={row.slug}
          row={row}
          onSaved={(saved) => setRows((current) => current && current.map((r) => (r.slug === saved.slug ? { ...r, ...saved } : r)))}
        />
      ))}
    </div>
  );
}
