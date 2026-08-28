"use client";

import { useState } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { QuizAdminEditor } from "@/components/quiz-admin-editor";
import { Button } from "@/components/ui/button";
import { getProductsByCategory } from "@/lib/products";

const cursos = getProductsByCategory("curso");

export default function AdminCuestionariosPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Cuestionarios</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Elegí un curso para crear o editar su cuestionario de repaso.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {cursos.map((curso) => (
            <Button
              key={curso.slug}
              type="button"
              variant={selectedSlug === curso.slug ? "default" : "outline"}
              onClick={() => setSelectedSlug(curso.slug)}
            >
              {curso.title}
            </Button>
          ))}
        </div>

        {selectedSlug && (
          <div className="mt-8">
            <QuizAdminEditor slug={selectedSlug} />
          </div>
        )}
      </section>
    </AuthGuard>
  );
}
