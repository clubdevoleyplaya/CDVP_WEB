"use client";

import { useMemo } from "react";
import { EChart } from "@/components/echart";
import { useTheme } from "@/lib/use-theme";
import { AuthGuard } from "@/components/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DAILY_LABELS,
  DAILY_SALES_ARS,
  DAILY_VISITS,
  REVENUE_BY_CATEGORY,
  TOP_PRODUCTS,
  STATS,
} from "@/lib/admin-mock";

const BRAND = {
  light: {
    blue: "#1F4FA0",
    yellow: "#C9920A",
    green: "#2F9E5B",
    ink: "#2B2166",
    inkSoft: "#4B4A78",
    line: "#DBDEEF",
  },
  dark: {
    blue: "#6FA3E0",
    yellow: "#F7B733",
    green: "#5FCB90",
    ink: "#F4F6FB",
    inkSoft: "#B7B6DE",
    line: "#4A3F8F",
  },
};

function formatArs(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

export default function AdminAnalyticsPage() {
  const theme = useTheme();
  const c = BRAND[theme];

  const salesVisitsOption = useMemo(
    () => ({
      textStyle: {
        color: c.inkSoft,
        fontFamily: "var(--font-sans, sans-serif)",
      },
      tooltip: { trigger: "axis" as const },
      legend: {
        data: ["Ventas (ARS)", "Visitas"],
        textStyle: { color: c.inkSoft },
      },
      grid: { left: 48, right: 48, top: 40, bottom: 28 },
      xAxis: {
        type: "category" as const,
        data: DAILY_LABELS,
        axisLine: { lineStyle: { color: c.line } },
        axisLabel: { color: c.inkSoft },
      },
      yAxis: [
        {
          type: "value" as const,
          name: "Ventas (ARS)",
          axisLabel: {
            color: c.inkSoft,
            formatter: (v: number) => `$${v / 1000}k`,
          },
          splitLine: { lineStyle: { color: c.line } },
        },
        {
          type: "value" as const,
          name: "Visitas",
          axisLabel: { color: c.inkSoft },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Ventas (ARS)",
          type: "bar" as const,
          data: DAILY_SALES_ARS,
          itemStyle: { color: c.blue, borderRadius: [4, 4, 0, 0] },
        },
        {
          name: "Visitas",
          type: "line" as const,
          yAxisIndex: 1,
          data: DAILY_VISITS,
          smooth: true,
          itemStyle: { color: c.yellow },
          lineStyle: { width: 3 },
        },
      ],
    }),
    [c],
  );

  const categoryOption = useMemo(
    () => ({
      textStyle: {
        color: c.inkSoft,
        fontFamily: "var(--font-sans, sans-serif)",
      },
      tooltip: { trigger: "item" as const },
      legend: { bottom: 0, textStyle: { color: c.inkSoft } },
      color: [c.blue, c.green, c.yellow, c.inkSoft],
      series: [
        {
          name: "Ingresos por categoría",
          type: "pie" as const,
          radius: ["45%", "70%"],
          center: ["50%", "42%"],
          itemStyle: {
            borderColor: theme === "dark" ? "#362b7a" : "#ffffff",
            borderWidth: 2,
          },
          label: { color: c.inkSoft },
          data: REVENUE_BY_CATEGORY,
        },
      ],
    }),
    [c, theme],
  );

  const topProductsOption = useMemo(
    () => ({
      textStyle: {
        color: c.inkSoft,
        fontFamily: "var(--font-sans, sans-serif)",
      },
      tooltip: { trigger: "axis" as const },
      grid: { left: 120, right: 24, top: 16, bottom: 24 },
      xAxis: {
        type: "value" as const,
        axisLabel: { color: c.inkSoft },
        splitLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "category" as const,
        data: TOP_PRODUCTS.map((p) => p.name).reverse(),
        axisLabel: { color: c.inkSoft },
        axisLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          type: "bar" as const,
          data: TOP_PRODUCTS.map((p) => p.ventas).reverse(),
          itemStyle: { color: c.green, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 22,
        },
      ],
    }),
    [c],
  );

  return (
    <AuthGuard role="admin">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-baseline gap-4">
          <h1 className="font-display text-3xl font-bold uppercase">
            Panel admin
          </h1>
          <span className="font-display text-xs font-bold uppercase tracking-wide text-yellow">
            Demo — datos de ejemplo
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Vista solo para admins (protegida en el servidor por{" "}
          <code>proxy.ts</code>, que valida el rol contra{" "}
          <code>profiles.role</code> antes de dejar pasar la request). Los datos
          de ventas y visitas de abajo todavía son de ejemplo — falta
          reemplazarlos por datos reales del backend.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="font-sans">
            <CardHeader>
              <CardDescription>Ventas totales (14 días)</CardDescription>
              <CardTitle className="tabular text-2xl">
                {formatArs(STATS.ventasTotales)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="font-sans">
            <CardHeader>
              <CardDescription>Visitas totales (14 días)</CardDescription>
              <CardTitle className="tabular text-2xl">
                {STATS.visitasTotales.toLocaleString("es-AR")}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="font-sans">
            <CardHeader>
              <CardDescription>Conversión</CardDescription>
              <CardTitle className="tabular text-2xl">
                {STATS.conversion}%
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="font-sans">
            <CardHeader>
              <CardDescription>Ticket promedio</CardDescription>
              <CardTitle className="tabular text-2xl">
                {formatArs(STATS.ticketPromedio)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mt-6 font-sans">
          <CardHeader>
            <CardTitle>Ventas y visitas por día</CardTitle>
            <CardDescription>
              Últimos 14 días — datos de ejemplo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EChart option={salesVisitsOption} height={340} />
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>Ingresos por categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <EChart option={categoryOption} height={300} />
            </CardContent>
          </Card>
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>Productos más vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <EChart option={topProductsOption} height={300} />
            </CardContent>
          </Card>
        </div>
      </section>
    </AuthGuard>
  );
}
