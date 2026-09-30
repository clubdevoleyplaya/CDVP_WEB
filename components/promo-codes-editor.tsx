"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { CATEGORY_ROUTE_LABELS, CATEGORY_TO_ROUTE, type Category } from "@/lib/products";

type PromoCode = {
  id: string;
  code: string;
  percent_off: number;
  categories: Category[];
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  uses_count: number;
  active: boolean;
};

const CATEGORIES: Category[] = ["curso", "evento", "combo", "descargable"];
const API = process.env.NEXT_PUBLIC_API_URL;

function parseNumber(text: string): number | null {
  if (text.trim() === "") return null;
  const value = Number(text.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function formatDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("es-AR") : null;
}

function describeValidity(code: PromoCode) {
  const from = formatDate(code.starts_at);
  const to = formatDate(code.ends_at);
  if (from && to) return `Del ${from} al ${to}`;
  if (from) return `Desde el ${from}`;
  if (to) return `Hasta el ${to}`;
  return "Sin fecha límite";
}

export function PromoCodesEditor() {
  const { session } = useDemoState();
  const [codes, setCodes] = useState<PromoCode[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    }),
    [session],
  );

  useEffect(() => {
    if (!session) return;
    fetch(`${API}/api/v1/admin/codigos`, { headers: headers() })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCodes(data.codigos))
      .catch(() => setLoadError(true));
  }, [session, headers]);

  function replaceCode(updated: PromoCode) {
    setCodes((current) => (current ?? []).map((c) => (c.id === updated.id ? updated : c)));
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
      <CreateForm
        headers={headers}
        onCreated={(created) => setCodes((current) => [created, ...(current ?? [])])}
      />
      <div className="flex flex-col gap-4">
        {loadError ? (
          <p className="text-sm text-destructive">No se pudieron cargar los códigos. Probá de nuevo más tarde.</p>
        ) : codes === null ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : codes.length === 0 ? (
          <p className="text-sm text-ink-soft">Todavía no creaste ningún código.</p>
        ) : (
          codes.map((code) => (
            <CodeCard key={code.id} code={code} headers={headers} onChanged={replaceCode} />
          ))
        )}
      </div>
    </div>
  );
}

function CodeCard({
  code,
  headers,
  onChanged,
}: {
  code: PromoCode;
  headers: () => Record<string, string>;
  onChanged: (code: PromoCode) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function toggle() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/codigos/${code.id}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ active: !code.active }),
      });
      if (!res.ok) throw new Error();
      onChanged(await res.json());
      setMessage({ kind: "ok", text: "Guardado" });
    } catch {
      setMessage({ kind: "error", text: "No se pudo guardar. Probá de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  const where = code.categories.length
    ? code.categories.map((c) => CATEGORY_ROUTE_LABELS[CATEGORY_TO_ROUTE[c]]).join(", ")
    : "Todas las categorías";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {code.code}
          <span className="text-sm font-normal text-ink-soft">{code.percent_off}% de descuento</span>
        </CardTitle>
        <CardDescription>
          {where} · {describeValidity(code)} · usos: {code.uses_count}
          {code.max_uses !== null ? ` de ${code.max_uses}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={toggle} disabled={saving}>
          {code.active ? "Apagar" : "Encender"}
        </Button>
        <span className={code.active ? "text-sm text-green" : "text-sm text-ink-soft"}>
          {code.active ? "Encendido" : "Apagado"}
        </span>
        {message && (
          <span className={message.kind === "ok" ? "text-sm text-green" : "text-sm text-destructive"}>
            {message.text}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

function CreateForm({
  headers,
  onCreated,
}: {
  headers: () => Record<string, string>;
  onCreated: (code: PromoCode) => void;
}) {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const percentValue = parseNumber(percent);
  const usesValue = parseNumber(maxUses);
  const valid =
    code.trim() !== "" &&
    percentValue !== null &&
    percentValue > 0 &&
    percentValue <= 100 &&
    (maxUses.trim() === "" || (usesValue !== null && usesValue >= 1));

  function toggleCategory(category: Category) {
    setCategories((current) =>
      current.includes(category) ? current.filter((c) => c !== category) : [...current, category],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/codigos`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          code,
          percent_off: percentValue,
          categories,
          starts_at: startsAt ? new Date(`${startsAt}T00:00:00`).toISOString() : null,
          ends_at: endsAt ? new Date(`${endsAt}T23:59:59`).toISOString() : null,
          max_uses: maxUses.trim() === "" ? null : usesValue,
        }),
      });
      if (res.status === 409) {
        setMessage({ kind: "error", text: "Ese código ya existe. Elige otro." });
      } else if (res.status === 422) {
        setMessage({
          kind: "error",
          text: "Revisa los datos: el porcentaje va de 1 a 100 y la fecha de fin no puede ser anterior a la de inicio.",
        });
      } else if (!res.ok) {
        throw new Error();
      } else {
        onCreated(await res.json());
        setMessage({ kind: "ok", text: "Código creado" });
        setCode("");
        setPercent("");
        setCategories([]);
        setStartsAt("");
        setEndsAt("");
        setMaxUses("");
      }
    } catch {
      setMessage({ kind: "error", text: "No se pudo crear el código. Probá de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo código</CardTitle>
        <CardDescription>Por ejemplo BLACKFRIDAY con 25% hasta el domingo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promo-code">Código</Label>
            <Input id="promo-code" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promo-percent">Porcentaje de descuento</Label>
            <Input
              id="promo-percent"
              inputMode="decimal"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Dónde vale (ninguna marcada = todas)</legend>
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {CATEGORY_ROUTE_LABELS[CATEGORY_TO_ROUTE[category]]}
              </label>
            ))}
          </fieldset>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="promo-start">Desde</Label>
              <Input
                id="promo-start"
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="promo-end">Hasta</Label>
              <Input
                id="promo-end"
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promo-uses">Usos máximos (vacío = sin límite)</Label>
            <Input
              id="promo-uses"
              inputMode="numeric"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={!valid || saving}
            className="w-fit font-display text-xs font-bold uppercase tracking-wide"
          >
            {saving ? "Guardando..." : "Crear código"}
          </Button>
          {message && (
            <p className={message.kind === "ok" ? "text-sm text-green" : "text-sm text-destructive"}>
              {message.text}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
