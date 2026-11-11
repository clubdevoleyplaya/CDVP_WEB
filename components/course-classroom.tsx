"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, ChevronLeft, ChevronRight, Play, PartyPopper } from "lucide-react";

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
  const t = useTranslations("Classroom");
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

  if (lessons === null) return <p className="px-4 py-16 text-center text-sm text-ink-soft">{t("loading")}</p>;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <nav aria-label={t("breadcrumbs")} className="mb-4 flex items-center gap-1 text-sm text-ink-soft">
        <Link href="/perfil" className="hover:text-blue">
          {t("myCourses")}
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

const GENERATED_MODULE = /^Módulo \d+$/;

function Viewer({ slug, lessons, description, email }: { slug: string; lessons: Lesson[]; description: string; email?: string }) {
  const t = useTranslations("Classroom");
  const storageKey = `cdvp-seen:${slug}`; // misma clave de siempre: no se pierde el avance guardado
  const [completed, setCompleted] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      return [];
    }
  });
  // Retoma en la primera clase sin completar.
  const [current, setCurrent] = useState(() => Math.max(0, lessons.findIndex((l) => !completed.includes(l.position))));
  const sectionOf = (l: Lesson) => l.section ?? NO_SECTION;
  const [open, setOpen] = useState<string[]>(() => [sectionOf(lessons[current])]);

  const lesson = lessons[current];
  const isDone = (l: Lesson) => completed.includes(l.position);
  const last = current === lessons.length - 1;
  const finished = completed.length === lessons.length;
  const percent = Math.round((completed.length / lessons.length) * 100);
  // Acordeón solo si Juli nombró las secciones; los «Módulo N» generados van en lista continua.
  const named = lessons.some((l) => l.section && !GENERATED_MODULE.test(l.section));
  const sections = [...new Set(lessons.map(sectionOf))];

  function go(i: number) {
    if (i < 0 || i >= lessons.length) return;
    setCurrent(i);
    setOpen((o) => (o.includes(sectionOf(lessons[i])) ? o : [...o, sectionOf(lessons[i])]));
  }

  function toggleCompleted(position: number, value?: boolean) {
    setCompleted((prev) => {
      const has = prev.includes(position);
      if (value === has) return prev;
      const next = has ? prev.filter((p) => p !== position) : [...prev, position];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  useEffect(() => {
    document.querySelector(`[data-lesson="${current}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const row = (l: Lesson, i: number) => (
    <li key={l.position} data-lesson={i}>
      <button
        type="button"
        onClick={() => go(i)}
        aria-current={i === current ? "true" : undefined}
        className={`flex w-full items-start gap-3 border-l-2 px-3 py-2.5 text-left text-base leading-snug ${
          i === current ? "border-blue bg-blue/10 font-semibold" : "border-transparent hover:bg-surface"
        }`}
      >
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-xs text-ink-soft">
          {isDone(l) ? <Check className="size-4 text-green" /> : i === current ? <Play className="size-4 fill-current text-blue" /> : i + 1}
        </span>
        {l.title}
      </button>
    </li>
  );

  const continuous = () => {
    const count = (name: string | null) => lessons.filter((l) => l.section === name).length;
    return (
      <ol className="flex flex-col">
        {lessons.map((l, i) => (
          <Fragment key={l.position}>
            {l.section && l.section !== lessons[i - 1]?.section && count(l.section) > 1 && (
              <li className="mt-3 border-b border-line px-3 pb-1 font-display text-xs font-bold uppercase tracking-wide text-ink-soft first:mt-0">
                {l.section}
              </li>
            )}
            {row(l, i)}
          </Fragment>
        ))}
      </ol>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="overflow-hidden rounded-xl shadow-lg">
          <VideoPlayer provider={lesson.provider} videoId={lesson.video_id} watermark={email} />
        </div>
        <div>
          <p className="text-sm text-ink-soft">
            {lesson.section ? `${lesson.section} · ` : ""}
            {t("lessonOf", { current: current + 1, total: lessons.length })}
          </p>
          <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-y border-line py-3">
          <Button type="button" variant="outline" size="lg" disabled={current === 0} onClick={() => go(current - 1)}>
            <ChevronLeft className="size-4" /> {t("previous")}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            aria-pressed={isDone(lesson)}
            className={isDone(lesson) ? "border-green text-green" : ""}
            onClick={() => toggleCompleted(lesson.position)}
          >
            <Check className="size-4" /> {isDone(lesson) ? t("completed") : t("markCompleted")}
          </Button>
          <Button
            type="button"
            size="lg"
            className="ml-auto"
            onClick={() => (last ? toggleCompleted(lesson.position, true) : go(current + 1))}
          >
            {last ? t("finish") : t("next")} <ChevronRight className="size-4" />
          </Button>
        </div>
        <section>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">{t("description")}</h2>
          <p className="mt-2 max-w-[65ch] text-sm text-ink-soft">{description}</p>
        </section>
      </div>

      <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide">{t("syllabus")}</h2>
        {finished ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-green">
            <PartyPopper className="size-4" /> {t("courseDone")}
          </p>
        ) : (
          <Progress value={percent} aria-label={t("progressLabel")}>
            <span className="text-sm text-ink-soft">
              {t("progress", { percent, done: completed.length, total: lessons.length })}
            </span>
          </Progress>
        )}
        <div className="max-h-96 overflow-y-auto lg:max-h-[calc(100vh-12rem)]">
          {!named || sections.length === 1 ? (
            continuous()
          ) : (
            <div className="flex flex-col">
              {sections.map((name) => {
                const inSection = lessons.filter((l) => sectionOf(l) === name);
                // Un módulo con una sola clase no necesita acordeón: va como una fila más.
                if (inSection.length === 1) {
                  return (
                    <ol key={name} className="border-b border-line">
                      {row(inSection[0], lessons.indexOf(inSection[0]))}
                    </ol>
                  );
                }
                return (
                  <Accordion
                    key={name}
                    value={open.includes(name) ? [name] : []}
                    onValueChange={(v) => setOpen((o) => (v.length ? [...o, name] : o.filter((x) => x !== name)))}
                    multiple
                  >
                    <AccordionItem value={name}>
                      <AccordionTrigger className="px-3 font-display text-sm font-bold uppercase tracking-wide">
                        <span className="flex-1">{name === NO_SECTION ? t("noSection") : name}</span>
                        <span className="mr-2 font-sans text-xs font-normal normal-case text-ink-soft">
                          {inSection.filter(isDone).length}/{inSection.length}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="flex flex-col">
                          {inSection.map((l) => row(l, lessons.indexOf(l)))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
