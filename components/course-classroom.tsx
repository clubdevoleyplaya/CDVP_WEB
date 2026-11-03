"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/video-player";
import { useDemoState } from "@/context/demo-state";
import type { VideoProvider } from "@/lib/video-link";

export type Lesson = { position: number; section: string | null; title: string; provider: VideoProvider; video_id: string };
type Props = { slug: string; title: string; description: string };

const NO_SECTION = "Clases";
const API = process.env.NEXT_PUBLIC_API_URL;

export function CourseClassroom({ slug, title, description }: Props) {
  const { session } = useDemoState();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [video, setVideo] = useState<{ provider: VideoProvider | null; videoId: string | null } | null>(null);

  useEffect(() => {
    if (!session) return;
    const headers = { Authorization: `Bearer ${session.access_token}` };
    const toShop = () => router.replace(`/producto/${slug}`);

    fetch(`${API}/api/v1/products/${slug}/lessons`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.lessons?.length) return setLessons(data.lessons);
        // Curso con un solo video (sin lecciones cargadas).
        return fetch(`${API}/api/v1/products/${slug}/video`, { headers })
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((v) => {
            setLessons([]);
            setVideo({ provider: v.provider ?? null, videoId: v.video_id ?? null });
          });
      })
      .catch(toShop);
  }, [session, slug, router]);

  if (lessons === null) return <p className="px-4 py-16 text-center text-sm text-ink-soft">Cargando tu curso...</p>;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <nav aria-label="Migas" className="mb-4 flex items-center gap-1 text-sm text-ink-soft">
        <Link href="/perfil" className="hover:text-blue">
          Mis cursos
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink">{title}</span>
      </nav>
      {lessons.length > 0 ? (
        <Viewer slug={slug} lessons={lessons} description={description} email={session?.user.email} />
      ) : (
        <div className="max-w-3xl">
          <VideoPlayer provider={video?.provider ?? null} videoId={video?.videoId ?? null} watermark={session?.user.email} />
          <p className="mt-4 text-sm text-ink-soft">{description}</p>
        </div>
      )}
    </div>
  );
}

function Viewer({ slug, lessons, description, email }: { slug: string; lessons: Lesson[]; description: string; email?: string }) {
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
  const sectionOf = (l: Lesson) => l.section ?? NO_SECTION;
  const [open, setOpen] = useState<string[]>(() => [sectionOf(lessons[current])]);

  function go(i: number) {
    setCurrent(i);
    setOpen((o) => (o.includes(sectionOf(lessons[i])) ? o : [...o, sectionOf(lessons[i])]));
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
  const sections = [...new Set(lessons.map(sectionOf))];
  const percent = Math.round((seen.length / lessons.length) * 100);

  const list = (name: string) => (
    <ol className="flex flex-col gap-0.5">
      {lessons.map((l, i) =>
        sectionOf(l) !== name ? null : (
          <li key={l.position}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === current ? "true" : undefined}
              className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-base leading-snug ${
                i === current ? "bg-blue/15 font-semibold" : "hover:bg-surface"
              }`}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-xs text-ink-soft">
                {i === current ? (
                  <Play className="size-4 fill-current text-blue" />
                ) : seen.includes(l.position) ? (
                  <Check className="size-4 text-green" />
                ) : (
                  i + 1
                )}
              </span>
              {l.title}
            </button>
          </li>
        ),
      )}
    </ol>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex min-w-0 flex-col gap-4">
        <VideoPlayer provider={lesson.provider} videoId={lesson.video_id} watermark={email} />
        <div>
          <p className="text-sm text-ink-soft">
            Clase {current + 1} de {lessons.length}
            {lesson.section ? ` · ${lesson.section}` : ""}
          </p>
          <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <Button type="button" variant="outline" size="lg" disabled={current === 0} onClick={() => go(current - 1)}>
            <ChevronLeft className="size-4" /> Anterior
          </Button>
          <Button
            type="button"
            size="lg"
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
        <p className="max-w-[65ch] border-t border-line pt-4 text-sm text-ink-soft">{description}</p>
      </div>

      <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide">Temario del curso</h2>
        <Progress value={percent} aria-label="Avance del curso">
          <span className="text-sm text-ink-soft">
            {percent}% · {seen.length} de {lessons.length} clases vistas
          </span>
        </Progress>
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {sections.length === 1 ? (
            list(sections[0])
          ) : (
            <Accordion value={open} onValueChange={setOpen} multiple>
              {sections.map((name) => (
                <AccordionItem key={name} value={name}>
                  <AccordionTrigger className="px-3 font-display text-sm font-bold uppercase tracking-wide">
                    {name}
                  </AccordionTrigger>
                  <AccordionContent>{list(name)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </aside>
    </div>
  );
}
