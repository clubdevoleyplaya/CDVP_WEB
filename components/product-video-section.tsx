"use client";

import { useEffect, useState } from "react";

import { VideoPlayer } from "@/components/video-player";
import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";
import type { VideoProvider } from "@/lib/video-link";

type ProductVideoSectionProps = { slug: string; category: Category };
type Lesson = { position: number; section: string | null; title: string; provider: VideoProvider; video_id: string };

export function ProductVideoSection({ slug, category }: ProductVideoSectionProps) {
  const { session } = useDemoState();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [current, setCurrent] = useState(0);
  const [video, setVideo] = useState<{ provider: VideoProvider | null; videoId: string | null } | undefined>(undefined);

  useEffect(() => {
    if (!session || category !== "curso") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${slug}/video`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setVideo({ provider: data.provider ?? null, videoId: data.video_id ?? null }))
      .catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${slug}/lessons`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setLessons(data.lessons ?? []))
      .catch(() => {});
  }, [session, category, slug]);

  if (lessons.length > 0) {
    const lesson = lessons[Math.min(current, lessons.length - 1)];
    return (
      <div className="mt-8 grid max-w-4xl gap-6 md:grid-cols-[2fr_1fr]">
        <VideoPlayer provider={lesson.provider} videoId={lesson.video_id} watermark={session?.user.email} />
        <ol className="flex max-h-[28rem] flex-col gap-1 overflow-y-auto text-sm">
          {lessons.map((l, i) => (
            <li key={l.position}>
              {l.section && l.section !== lessons[i - 1]?.section && (
                <p className="mt-3 font-display text-xs font-bold uppercase tracking-wide text-ink-soft">{l.section}</p>
              )}
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current}
                className={`w-full rounded-md px-3 py-2 text-left ${i === current ? "bg-surface font-bold" : "hover:bg-surface"}`}
              >
                {l.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (video === undefined) return null;

  return (
    <div className="mt-8 max-w-2xl">
      <VideoPlayer provider={video.provider} videoId={video.videoId} watermark={session?.user.email} />
    </div>
  );
}
