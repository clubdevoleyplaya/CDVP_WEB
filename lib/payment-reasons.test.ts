import { describe, expect, it } from "vitest";

import { describeUnfulfilledReason, formatAmount } from "./payment-reasons";

describe("describeUnfulfilledReason", () => {
  it.each(["orden_cancelada", "orden_pendiente", "monto_o_moneda_no_coinciden"])(
    "explica %s en lenguaje simple y dice qué hacer",
    (reason) => {
      const text = describeUnfulfilledReason(reason);
      expect(text.title.length).toBeGreaterThan(5);
      expect(text.action.length).toBeGreaterThan(10);
      expect(`${text.title} ${text.action}`).not.toMatch(/_|payload|webhook/i);
    },
  );

  it("un motivo desconocido no rompe la pantalla", () => {
    const text = describeUnfulfilledReason("algo_nuevo");
    expect(text.title).toBeTruthy();
    expect(text.action).toBeTruthy();
  });
});

describe("formatAmount", () => {
  it("formatea pesos y dólares", () => {
    expect(formatAmount("1000.00", "ARS")).toContain("1.000");
    expect(formatAmount("25.00", "USD")).toContain("25");
    expect(formatAmount("25.00", "USD")).toContain("USD");
  });

  it("devuelve un guion si no hay monto", () => {
    expect(formatAmount(null, "ARS")).toBe("—");
    expect(formatAmount("no es número", "ARS")).toBe("—");
  });
});
