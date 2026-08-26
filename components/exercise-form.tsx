"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ExerciseFormValues = {
  title: string;
  content: string;
  videoUrl: string;
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
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit() {
    if (!title.trim() || !content.trim() || !videoUrl.trim()) {
      setValidationError("Los 3 campos son obligatorios.");
      return;
    }
    setValidationError(null);
    onSave({ title, content, videoUrl });
  }

  return (
    <Card className="font-sans">
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
  );
}
