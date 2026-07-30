"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CATEGORY_ROUTE_LABELS, type CategoryRoute } from "@/lib/products";

const NAV_ROUTES = ["cursos", "programas", "descargables", "combos"] as const satisfies readonly CategoryRoute[];

export function NavDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="font-sans md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-4" />
          </Button>
        }
      />
      <DrawerContent className="font-sans sm:max-w-xs">
        <DrawerHeader>
          <DrawerTitle>Menú</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_ROUTES.map((route) => (
            <DrawerClose
              key={route}
              nativeButton={false}
              render={
                <Link
                  href={`/catalogo/${route}`}
                  className="font-display rounded-md px-2 py-2.5 text-sm font-bold tracking-wide uppercase hover:bg-accent"
                >
                  {CATEGORY_ROUTE_LABELS[route]}
                </Link>
              }
            />
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2 border-t border-border p-4">
          <Button variant="outline" className="font-display text-xs font-bold tracking-wide uppercase">
            Iniciar sesión
          </Button>
          <Button className="font-display text-xs font-bold tracking-wide uppercase">
            Registrate
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
