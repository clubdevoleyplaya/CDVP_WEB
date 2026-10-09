export type UnfulfilledReasonText = { title: string; action: string };

const REASONS: Record<string, UnfulfilledReasonText> = {
  orden_cancelada: {
    title: "Pagó una orden que ya estaba cancelada",
    action:
      "Suele pasar al reintentar con un código promocional. No recibió acceso. Revisa en el proveedor de pago y reembolsa, o dale el acceso a mano si corresponde.",
  },
  orden_pendiente: {
    title: "Pagó, pero la orden quedó sin completar",
    action:
      "El cobro existe y no se le dio acceso. Revisa en el proveedor de pago y dale el acceso a mano o reembolsa.",
  },
  monto_o_moneda_no_coinciden: {
    title: "Lo cobrado no coincide con la orden",
    action:
      "El monto o la moneda cobrados son distintos a los de la orden, así que no se le dio acceso. Revisa el cobro en el proveedor de pago y reembolsa o corrige a mano.",
  },
};

export function describeUnfulfilledReason(reason: string): UnfulfilledReasonText {
  return (
    REASONS[reason] ?? {
      title: "Cobro sin acceso entregado",
      action: "Revisa este pago en el proveedor de pago y decide si reembolsar o dar el acceso a mano.",
    }
  );
}

export function formatAmount(amount: string | number | null | undefined, currency: string | null | undefined): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (amount === null || amount === undefined || amount === "" || !Number.isFinite(value)) return "—";
  const number = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  if (currency === "USD" || currency === "EUR") return `${number} ${currency}`;
  return `$ ${number}`;
}
