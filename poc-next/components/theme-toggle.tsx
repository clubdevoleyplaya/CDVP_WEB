"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("cdvp-theme", next);
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema claro/oscuro"
      className="rounded-sm border border-ink/20 px-3 py-1.5 text-sm hover:border-blue hover:text-blue transition-colors"
    >
      🌗
    </button>
  );
}
