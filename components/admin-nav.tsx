"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_SECTIONS } from "@/lib/admin-sections";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones de administración" className="border-b border-line bg-bg">
      <ul className="flex gap-2 overflow-x-auto px-6 py-2">
        {ADMIN_SECTIONS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition-colors ${
                  active ? "bg-blue text-white" : "text-ink hover:text-blue"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
