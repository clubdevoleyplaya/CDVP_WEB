// Respuestas públicas que casi no cambian (descuentos, precios en euros): se guardan unos minutos
// en sessionStorage y se comparten entre pestañas de la misma visita, para no pedirlas a la API
// en cada página. Si el almacenamiento falla o no existe, se pide normal.

const inFlight = new Map<string, Promise<unknown>>();

export async function cachedJson<T>(url: string, ttlMs = 10 * 60 * 1000): Promise<T | null> {
  const key = `cdvp.cache:${url}`;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const { at, data } = JSON.parse(raw) as { at: number; data: T };
      if (Date.now() - at < ttlMs) return data;
    }
  } catch {
    // sin storage: se pide igual
  }
  let pending = inFlight.get(key) as Promise<T | null> | undefined;
  if (!pending) {
    pending = fetch(url)
      .then(async (res) => (res.ok ? ((await res.json()) as T) : null))
      .finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }
  const data = await pending;
  if (data !== null) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
    } catch {
      // sin storage o cuota llena: no pasa nada
    }
  }
  return data;
}
