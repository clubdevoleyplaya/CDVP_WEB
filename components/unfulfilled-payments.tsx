"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { describeUnfulfilledReason, formatAmount } from "@/lib/payment-reasons";

type UnfulfilledPayment = {
  payment_id: string;
  provider: "mercadopago" | "paddle";
  provider_transaction_id: string;
  reason: string;
  created_at: string;
  order: { id: string | null; status: string | null; total_amount: string | null; currency: string | null };
  customer: { email: string | null; full_name: string | null };
};

const API = process.env.NEXT_PUBLIC_API_URL;
const PROVIDER_LABEL = { mercadopago: "MercadoPago", paddle: "Paddle" } as const;

export function UnfulfilledPayments() {
  const { session } = useDemoState();
  const [payments, setPayments] = useState<UnfulfilledPayment[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`${API}/api/v1/admin/pagos-sin-acceso`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPayments(data.pagos))
      .catch(() => setLoadError(true));
  }, [session]);

  if (loadError) {
    return <p className="text-sm text-destructive">No se pudo cargar la lista. Intenta de nuevo en un momento.</p>;
  }
  if (!payments) {
    return <Skeleton className="h-32 w-full max-w-3xl" />;
  }
  if (payments.length === 0) {
    return <p className="text-sm text-ink-soft">No hay pagos pendientes de revisar.</p>;
  }

  return (
    <ul className="grid max-w-3xl gap-4">
      {payments.map((payment) => {
        const text = describeUnfulfilledReason(payment.reason);
        return (
          <li key={payment.payment_id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{text.title}</CardTitle>
                <CardDescription>
                  {PROVIDER_LABEL[payment.provider]} · {new Date(payment.created_at).toLocaleString("es-AR")}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <p>
                  <strong>Cliente:</strong> {payment.customer.full_name ?? "—"} ({payment.customer.email ?? "sin correo"})
                </p>
                <p>
                  <strong>Monto de la orden:</strong> {formatAmount(payment.order.total_amount, payment.order.currency)}
                </p>
                <p className="break-all text-ink-soft">
                  Código del cobro en {PROVIDER_LABEL[payment.provider]}: {payment.provider_transaction_id}
                </p>
                <p className="text-ink-soft">{text.action}</p>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
