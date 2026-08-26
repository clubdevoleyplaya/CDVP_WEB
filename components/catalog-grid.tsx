"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice } from "@/lib/price";
import type { Product } from "@/lib/products";

type SortBy = "relevancia" | "precio-asc" | "precio-desc" | "mejor-valorados";

const SORT_LABELS: Record<SortBy, string> = {
  relevancia: "Relevancia",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  "mejor-valorados": "Mejor valorados",
};

export function CatalogGrid({ items }: { items: Product[] }) {
  const { currency, isSubscriber } = useDemoState();
  const [sortBy, setSortBy] = useState<SortBy>("relevancia");
  const [onlyDiscountable, setOnlyDiscountable] = useState(false);
  const [open, setOpen] = useState(false);

  const visible = useMemo(() => {
    let result = onlyDiscountable ? items.filter((p) => p.discountable) : items;

    if (sortBy === "mejor-valorados") {
      result = [...result].sort(
        (a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0),
      );
    } else if (sortBy === "precio-asc" || sortBy === "precio-desc") {
      const withPrice = result.map((p) => ({
        product: p,
        price: computeDisplayPrice(p, currency, isSubscriber).now,
      }));
      withPrice.sort((a, b) =>
        sortBy === "precio-asc" ? a.price - b.price : b.price - a.price,
      );
      result = withPrice.map((w) => w.product);
    }

    return result;
  }, [items, sortBy, onlyDiscountable, currency, isSubscriber]);

  const activeFilters =
    (onlyDiscountable ? 1 : 0) + (sortBy !== "relevancia" ? 1 : 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          {visible.length} {visible.length === 1 ? "producto" : "productos"}
        </p>
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
          <DrawerTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="font-sans gap-2"
              >
                <SlidersHorizontal className="size-4" />
                Filtros y orden
                {activeFilters > 0 && (
                  <span className="tabular flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </Button>
            }
          />
          <DrawerContent className="font-sans sm:max-w-xs">
            <DrawerHeader>
              <DrawerTitle>Filtros y orden</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-6 px-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Ordenar por
                </span>
                <Select
                  items={SORT_LABELS}
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortBy)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SORT_LABELS) as SortBy[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {SORT_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={onlyDiscountable}
                  onChange={(e) => setOnlyDiscountable(e.target.checked)}
                  className="size-4 accent-blue"
                />
                Solo con 50% OFF para suscriptores
              </label>
            </div>
            <DrawerFooter>
              <DrawerClose
                render={
                  <Button
                    type="button"
                    className="font-display text-xs font-bold tracking-wide uppercase"
                  >
                    Ver resultados
                  </Button>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
