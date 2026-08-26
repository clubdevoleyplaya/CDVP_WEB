"use client";

import { useEffect, useState } from "react";

import { VimeoPlayer } from "@/components/vimeo-player";
import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";

type ProductVideoSectionProps = { slug: string; category: Category };

export function ProductVideoSection({ slug, category }: ProductVideoSectionProps) {
  const { session } = useDemoState();
  const [videoId, setVideoId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!session || category !== "curso") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${slug}/video`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setVideoId(data.vimeo_video_id))
      .catch(() => {});
  }, [session, category, slug]);

  if (videoId === undefined) return null;

  return (
    <div className="mt-8 max-w-2xl">
      <VimeoPlayer videoId={videoId} />
    </div>
  );
}
