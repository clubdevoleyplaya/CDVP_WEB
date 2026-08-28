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
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CATEGORY_ROUTE_LABELS, type CategoryRoute } from "@/lib/products";
import { useDemoState } from "@/context/demo-state";

const NAV_ROUTES = [
  "cursos",
  "descargables",
  "combos",
  "eventos",
] as const satisfies readonly CategoryRoute[];

export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const { session, me, signOut } = useDemoState();
  const displayName = me?.nickname || session?.user.email;
  const initial = (displayName ?? "?").charAt(0).toUpperCase();

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
          {session ? (
            <>
              <DrawerClose
                nativeButton={false}
                render={
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 rounded-lg border border-ink px-3 py-2 font-display text-xs font-bold uppercase tracking-wide"
                  >
                    <Avatar size="sm">
                      {me?.avatarUrl ? (
                        <AvatarImage src={me.avatarUrl} alt="" />
                      ) : null}
                      <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                    {displayName}
                  </Link>
                }
              />
              <Button
                type="button"
                variant="outline"
                className="font-display text-xs font-bold tracking-wide uppercase"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <DrawerClose
                nativeButton={false}
                render={
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      className: "font-display text-xs font-bold tracking-wide uppercase",
                    })}
                  >
                    Iniciar sesión
                  </Link>
                }
              />
              <DrawerClose
                nativeButton={false}
                render={
                  <Link
                    href="/signup"
                    className="rounded-lg border border-blue bg-blue px-4 py-2 text-center font-display text-xs font-bold uppercase tracking-wide text-white"
                  >
                    Registrate
                  </Link>
                }
              />
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
