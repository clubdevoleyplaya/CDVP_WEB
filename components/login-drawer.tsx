"use client";

import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";
import { useDemoState } from "@/context/demo-state";

export function LoginDrawer() {
  const { loginOpen, setLoginOpen } = useDemoState();

  return (
    <Drawer open={loginOpen} onOpenChange={setLoginOpen} swipeDirection="right">
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="hidden font-sans font-display text-xs font-bold uppercase tracking-wide md:inline-flex"
          >
            Iniciar sesión
          </Button>
        }
      />
      <DrawerContent className="font-sans sm:max-w-sm">
        <div className="flex flex-1 flex-col justify-center overflow-y-auto px-4">
          <DrawerHeader className="p-0 pb-4">
            <DrawerTitle>Iniciar sesión</DrawerTitle>
          </DrawerHeader>

          <LoginForm onSuccess={() => setLoginOpen(false)} />

          <p className="mt-6 text-sm">
            ¿No tenés cuenta?{" "}
            <Link
              href="/signup"
              onClick={() => setLoginOpen(false)}
              className="font-bold text-blue underline"
            >
              Registrate
            </Link>
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
