"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExercisePreview } from "@/components/exercise-preview";

export type ExerciseFormValues = {
  title: string;
  content: string;
  videoUrl: string;
  pdfUrl: string;
  photoUrls: string[];
};

type ExerciseFormProps = {
  initialValues?: ExerciseFormValues;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSave: (values: ExerciseFormValues) => void;
};

export function ExerciseForm({
  initialValues,
  saving,
  error,
  onCancel,
  onSave,
}: ExerciseFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [videoUrl, setVideoUrl] = useState(initialValues?.videoUrl ?? "");
  const [pdfUrl, setPdfUrl] = useState(initialValues?.pdfUrl ?? "");
  const [photoUrls, setPhotoUrls] = useState<string[]>(initialValues?.photoUrls ?? []);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit() {
    if (!title.trim() || !content.trim() || !videoUrl.trim()) {
      setValidationError("Título, contenido y video son obligatorios.");
      return;
    }
    setValidationError(null);
    onSave({
      title,
      content,
      videoUrl,
      pdfUrl,
      photoUrls: photoUrls.map((url) => url.trim()).filter(Boolean),
    });
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
    <Card className="font-sans lg:flex-1">
      <CardHeader>
        <CardTitle>{initialValues ? "Editar ejercicio" : "Nuevo ejercicio"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exercise-title">Título</Label>
          <Input
            id="exercise-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exercise-content">Contenido</Label>
          <textarea
            id="exercise-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exercise-video">Link de video (Vimeo o YouTube)</Label>
          <Input
            id="exercise-video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://vimeo.com/... o https://youtube.com/watch?v=..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exercise-pdf">Link de PDF (opcional)</Label>
          <Input
            id="exercise-pdf"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Fotos (opcional)</Label>
          <div className="flex flex-col gap-2">
            {photoUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) =>
                    setPhotoUrls((prev) =>
                      prev.map((p, i) => (i === index ? e.target.value : p)),
                    )
                  }
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPhotoUrls((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Quitar
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setPhotoUrls((prev) => [...prev, ""])}
              className="w-fit"
            >
              Agregar foto
            </Button>
          </div>
        </div>

        {(validationError || error) && (
          <p className="text-sm text-destructive">{validationError || error}</p>
        )}

        <div className="flex gap-2">
          <Button type="button" onClick={handleSubmit} disabled={saving} className="w-fit">
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="w-fit"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>

    <div className="lg:sticky lg:top-4 lg:w-[28rem] xl:w-[32rem]">
      <ExercisePreview
        values={{ title, content, videoUrl, pdfUrl, photoUrls }}
      />
    </div>
    </div>
  );
}
