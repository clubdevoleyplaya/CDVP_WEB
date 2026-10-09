"use client";

import { useEffect, useState } from "react";

import { VideoPlayer } from "@/components/video-player";
import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";
import type { VideoProvider } from "@/lib/video-link";

type ProductVideoSectionProps = { slug: string; category: Category };

export function ProductVideoSection({ slug, category }: ProductVideoSectionProps) {
  const { session } = useDemoState();
  const [video, setVideo] = useState<{ provider: VideoProvider | null; videoId: string | null } | undefined>(undefined);

  useEffect(() => {
    if (!session || category !== "curso") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${slug}/video`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setVideo({ provider: data.provider ?? null, videoId: data.video_id ?? null }))
      .catch(() => {});
  }, [session, category, slug]);

  if (video === undefined) return null;

  return (
    <div className="mt-8 max-w-2xl">
      <VideoPlayer provider={video.provider} videoId={video.videoId} watermark={session?.user.email} />
    </div>
  );
}
