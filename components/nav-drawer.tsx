"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { MENU_ITEMS } from "@/lib/menu";
import { useDemoState } from "@/context/demo-state";

export function NavDrawer() {
  const t = useTranslations("NavDrawer");
  const tm = useTranslations("Menu");
  const th = useTranslations("Header");
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
            aria-label={t("open")}
          >
            <Menu className="size-4" />
          </Button>
        }
      />
      <DrawerContent className="font-sans sm:max-w-xs">
        <DrawerHeader>
          <DrawerTitle>{t("title")}</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 px-4">
          {MENU_ITEMS.map((item) => (
            <DrawerClose
              key={item.key}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  className="font-display rounded-md px-2 py-3 text-lg font-bold tracking-wide uppercase hover:bg-accent"
                >
                  {tm(item.key)}
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
                    className="flex items-center gap-2 rounded-lg border border-ink px-3 py-2 font-display text-base font-bold uppercase tracking-wide"
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
                className="font-display text-base font-bold tracking-wide uppercase"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
              >
                {th("signOut")}
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
                      className: "font-display text-base font-bold tracking-wide uppercase",
                    })}
                  >
                    {th("login")}
                  </Link>
                }
              />
              <DrawerClose
                nativeButton={false}
                render={
                  <Link
                    href="/signup"
                    className="rounded-lg border border-blue bg-blue px-4 py-2 text-center font-display text-base font-bold uppercase tracking-wide text-primary-foreground"
                  >
                    {th("signup")}
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
