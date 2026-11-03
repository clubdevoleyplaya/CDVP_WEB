"use client";

import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/video-player";
import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";
import type { VideoProvider } from "@/lib/video-link";

type ProductVideoSectionProps = { slug: string; category: Category };
type Lesson = { position: number; section: string | null; title: string; provider: VideoProvider; video_id: string };

export function ProductVideoSection({ slug, category }: ProductVideoSectionProps) {
  const { session } = useDemoState();
  const [lessons, setLessons] = useState<Lesson[]>([]);
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
    return <LessonViewer slug={slug} lessons={lessons} email={session?.user.email} />;
  }

  if (video === undefined) return null;

  return (
    <div className="mt-8 max-w-2xl">
      <VideoPlayer provider={video.provider} videoId={video.videoId} watermark={session?.user.email} />
    </div>
  );
}

const NO_SECTION = "Clases";

function LessonViewer({ slug, lessons, email }: { slug: string; lessons: Lesson[]; email?: string }) {
  const storageKey = `cdvp-seen:${slug}`;
  const [seen, setSeen] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      return [];
    }
  });
  // Retoma en la primera clase sin ver.
  const [current, setCurrent] = useState(() => Math.max(0, lessons.findIndex((l) => !seen.includes(l.position))));
  const [open, setOpen] = useState<string[]>(() => [lessons[current].section ?? NO_SECTION]);

  function go(i: number) {
    const target = lessons[i];
    setCurrent(i);
    setOpen((o) => (o.includes(target.section ?? NO_SECTION) ? o : [...o, target.section ?? NO_SECTION]));
  }

  function markSeen(position: number) {
    setSeen((prev) => {
      if (prev.includes(position)) return prev;
      const next = [...prev, position];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const lesson = lessons[current];
  const sections = [...new Set(lessons.map((l) => l.section ?? NO_SECTION))];
  const percent = Math.round((seen.length / lessons.length) * 100);

  return (
    <div className="mt-8 grid max-w-5xl gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <VideoPlayer provider={lesson.provider} videoId={lesson.video_id} watermark={email} />
        <div>
          <p className="text-xs text-ink-soft">
            Clase {current + 1} de {lessons.length}
            {lesson.section ? ` · ${lesson.section}` : ""}
          </p>
          <h2 className="font-display text-xl font-bold">{lesson.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={current === 0} onClick={() => go(current - 1)}>
            <ChevronLeft className="size-4" /> Anterior
          </Button>
          <Button
            type="button"
            variant={seen.includes(lesson.position) ? "outline" : "default"}
            onClick={() => {
              markSeen(lesson.position);
              if (current < lessons.length - 1) go(current + 1);
            }}
          >
            {current < lessons.length - 1 ? "Vista, siguiente" : "Marcar como vista"}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <aside className="flex flex-col gap-3 text-sm">
        <Progress value={percent} aria-label="Avance del curso">
          <span className="text-xs text-ink-soft">
            {seen.length} de {lessons.length} clases vistas
          </span>
        </Progress>
        <Accordion value={open} onValueChange={setOpen} className="max-h-[32rem] overflow-y-auto" multiple>
          {sections.map((name) => (
            <AccordionItem key={name} value={name}>
              <AccordionTrigger className="font-display text-xs font-bold uppercase tracking-wide">{name}</AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-0.5">
                  {lessons.map((l, i) =>
                    (l.section ?? NO_SECTION) !== name ? null : (
                      <li key={l.position}>
                        <button
                          type="button"
                          onClick={() => go(i)}
                          aria-current={i === current}
                          className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left ${
                            i === current ? "bg-surface font-bold" : "hover:bg-surface"
                          }`}
                        >
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]">
                            {seen.includes(l.position) ? <Check className="size-3 text-green" /> : i + 1}
                          </span>
                          {l.title}
                        </button>
                      </li>
                    ),
                  )}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>
    </div>
  );
}
