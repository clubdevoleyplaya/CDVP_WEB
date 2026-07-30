"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export function EChart({
  option,
  height = 320,
  className,
}: {
  option: echarts.EChartsOption;
  height?: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!el.current) return;
    chart.current = echarts.init(el.current);
    const onResize = () => chart.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.current?.dispose();
      chart.current = null;
    };
  }, []);

  useEffect(() => {
    chart.current?.setOption(option, true);
  }, [option]);

  return <div ref={el} className={className} style={{ height }} />;
}
