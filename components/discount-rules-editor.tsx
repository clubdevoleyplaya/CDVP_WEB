"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { DEFAULT_DISCOUNT_PERCENT, formatPrice, type DiscountPercent } from "@/lib/price";
import { CATEGORY_ROUTE_LABELS, CATEGORY_TO_ROUTE, products, type Category } from "@/lib/products";

const CATEGORIES = Object.keys(DEFAULT_DISCOUNT_PERCENT) as Category[];

function parsePercent(text: string): number | null {
  if (text.trim() === "") return null;
  const value = Number(text.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function DiscountRow({
  category,
  savedPercent,
  onSaved,
}: {
  category: Category;
  savedPercent: number;
  onSaved: (category: Category, percent: number) => void;
}) {
  const { session, currency } = useDemoState();
  const [text, setText] = useState(String(savedPercent));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const percent = parsePercent(text);
  const example = products.find((p) => p.category === category);
  const base = example ? (currency === "USD" ? example.priceUsd : example.priceArs) : null;
  const inRange = percent !== null && percent >= 0 && percent <= 100;
  const changed = percent !== savedPercent;

  async function handleSave() {
    if (!session || percent === null) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/descuentos/${category}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ percent_off: percent }),
        },
      );
      if (res.ok) {
        onSaved(category, percent);
        setMessage({ kind: "ok", text: "Guardado" });
      } else if (res.status === 422) {
        setMessage({ kind: "error", text: "El porcentaje tiene que estar entre 0 y 100." });
      } else {
        setMessage({ kind: "error", text: "No se pudo guardar. Probá de nuevo." });
      }
    } catch {
      setMessage({ kind: "error", text: "No se pudo guardar. Probá de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CATEGORY_ROUTE_LABELS[CATEGORY_TO_ROUTE[category]]}</CardTitle>
        <CardDescription>Descuento para suscriptores con la membresía activa.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`descuento-${category}`}>Porcentaje de descuento (%)</Label>
          <Input
            id={`descuento-${category}`}
            inputMode="decimal"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setMessage(null);
            }}
            aria-invalid={percent !== null && !inRange}
          />
        </div>
        {example && base !== null && inRange && (
          <p className="text-sm text-ink-soft">
            Ejemplo: <strong>{example.title}</strong> costaría{" "}
            <strong>{formatPrice(Math.round(base * (1 - percent / 100) * 100) / 100, currency)}</strong>{" "}
            en vez de {formatPrice(base, currency)}.
          </p>
        )}
        {percent !== null && !inRange && (
          <p role="alert" className="text-sm text-red-600">
            El porcentaje tiene que estar entre 0 y 100.
          </p>
        )}
        <div className="flex items-center gap-3">
          <Button type="button" onClick={handleSave} disabled={!inRange || !changed || saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
          {message && (
            <span
              role={message.kind === "error" ? "alert" : "status"}
              className={message.kind === "error" ? "text-sm text-red-600" : "text-sm text-green"}
            >
              {message.text}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DiscountRulesEditor() {
  const [rules, setRules] = useState<DiscountPercent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/descuentos`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setRules({ ...DEFAULT_DISCOUNT_PERCENT, ...data.descuentos }))
      .catch(() => setError("No se pudieron cargar los descuentos."));
  }, []);

  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>;
  if (!rules) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((c) => (
          <Skeleton key={c} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CATEGORIES.map((category) => (
        <DiscountRow
          key={category}
          category={category}
          savedPercent={rules[category]}
          onSaved={(c, percent) => setRules((prev) => (prev ? { ...prev, [c]: percent } : prev))}
        />
      ))}
    </div>
  );
}
