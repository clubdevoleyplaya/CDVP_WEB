"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { detectVideoProvider } from "@/lib/video-link";

import { ExerciseForm, type ExerciseFormValues } from "@/components/exercise-form";

type VideoProvider = "vimeo" | "youtube";

type Ejercicio = {
  id: string;
  title: string;
  content: string;
  video_provider: VideoProvider;
  video_id: string;
  pdf_url: string | null;
  photo_urls: string[];
};

function videoUrlFor(ejercicio: Ejercicio): string {
  if (ejercicio.video_provider === "vimeo") {
    return `https://vimeo.com/${ejercicio.video_id}`;
  }
  return `https://www.youtube.com/watch?v=${ejercicio.video_id}`;
}

export function GoteoCapsuleEditor() {
  const { session } = useDemoState();

  const [numeroCapsula, setNumeroCapsula] = useState(1);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    (n: number) => {
      if (!session) return;
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/goteo/${n}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => setEjercicios(data.ejercicios))
        .catch(() => setError("No se pudo cargar la cápsula."))
        .finally(() => setLoading(false));
    },
    [session],
  );

  useEffect(() => {
    load(numeroCapsula);
  }, [numeroCapsula, load]);

  function goToCapsule(n: number) {
    setNumeroCapsula(n);
    setLoading(true);
    setError(null);
    setEditingId(null);
    setSaveError(null);
  }

  async function handleSave(values: ExerciseFormValues) {
    if (!session) return;

    let provider: VideoProvider;
    let videoId: string;
    try {
      const detected = detectVideoProvider(values.videoUrl);
      provider = detected.provider;
      videoId = detected.videoId;
    } catch {
      setSaveError('"' + values.videoUrl + '" no es un link de Vimeo ni de YouTube');
      return;
    }

    const nextEjercicios =
      editingId === "new"
        ? [
            ...ejercicios,
            {
              id: "",
              title: values.title,
              content: values.content,
              video_provider: provider,
              video_id: videoId,
              pdf_url: values.pdfUrl.trim() || null,
              photo_urls: values.photoUrls,
            },
          ]
        : ejercicios.map((e) =>
            e.id === editingId
              ? {
                  ...e,
                  title: values.title,
                  content: values.content,
                  video_provider: provider,
                  video_id: videoId,
                  pdf_url: values.pdfUrl.trim() || null,
                  photo_urls: values.photoUrls,
                }
              : e,
          );

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/goteo/${numeroCapsula}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ejercicios: nextEjercicios.map((e) => ({
              id: e.id || null,
              title: e.title,
              content: e.content,
              video_url: videoUrlFor(e),
              pdf_url: e.pdf_url,
              photo_urls: e.photo_urls,
            })),
          }),
        },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEjercicios(data.ejercicios);
      setEditingId(null);
    } catch {
      setSaveError("No se pudo guardar el ejercicio. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const editing = editingId === "new" ? undefined : ejercicios.find((e) => e.id === editingId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToCapsule(numeroCapsula - 1)}
          disabled={numeroCapsula <= 1}
        >
          Anterior
        </Button>
        <span className="font-display text-sm font-bold uppercase tracking-wide">
          Cápsula {numeroCapsula} / 12
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => goToCapsule(numeroCapsula + 1)}
          disabled={numeroCapsula >= 12}
        >
          Siguiente
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {ejercicios.map((ejercicio) => (
            <Card key={ejercicio.id} className="font-sans">
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div>
                  <CardTitle className="text-base">{ejercicio.title}</CardTitle>
                  <p className="mt-1 text-xs text-ink-soft uppercase">
                    {ejercicio.video_provider}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(ejercicio.id);
                    setSaveError(null);
                  }}
                >
                  Editar
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            onClick={() => {
              setEditingId("new");
              setSaveError(null);
            }}
            className="w-fit"
          >
            Agregar ejercicio
          </Button>
        </div>
      )}

      {editingId && (
        <ExerciseForm
          initialValues={
            editing
              ? {
                  title: editing.title,
                  content: editing.content,
                  videoUrl: videoUrlFor(editing),
                  pdfUrl: editing.pdf_url ?? "",
                  photoUrls: editing.photo_urls,
                }
              : undefined
          }
          saving={saving}
          error={saveError}
          onCancel={() => {
            setEditingId(null);
            setSaveError(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
