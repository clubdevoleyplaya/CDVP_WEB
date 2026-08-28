"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";

type Question = { id: string; question_text: string; order_index: number };
type Quiz = { id: string; title: string; questions: Question[] };

type QuizAdminEditorProps = { slug: string };

export function QuizAdminEditor({ slug }: QuizAdminEditorProps) {
  const { session } = useDemoState();

  const [quiz, setQuiz] = useState<Quiz | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const load = useCallback(() => {
    if (!session) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cuestionarios/producto/${slug}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setQuiz(data.quiz))
      .catch(() => setError("No se pudo cargar el cuestionario."))
      .finally(() => setLoading(false));
  }, [session, slug]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !newTitle.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cuestionarios`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, title: newTitle.trim() }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuiz({ id: data.id, title: data.title ?? newTitle.trim(), questions: [] });
      setNewTitle("");
    } catch {
      setSaveError("No se pudo crear el cuestionario. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !quiz || !newQuestionText.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cuestionarios/${quiz.id}/preguntas`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_text: newQuestionText.trim(),
            order_index: quiz.questions.length,
          }),
        },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuiz({
        ...quiz,
        questions: [
          ...quiz.questions,
          { id: data.id, question_text: newQuestionText.trim(), order_index: quiz.questions.length },
        ],
      });
      setNewQuestionText("");
    } catch {
      setSaveError("No se pudo agregar la pregunta. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateQuestion(questionId: string) {
    if (!session || !quiz || !editingText.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cuestionarios/${quiz.id}/preguntas/${questionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question_text: editingText.trim() }),
        },
      );
      if (!res.ok) throw new Error();
      setQuiz({
        ...quiz,
        questions: quiz.questions.map((q) =>
          q.id === questionId ? { ...q, question_text: editingText.trim() } : q,
        ),
      });
      setEditingId(null);
    } catch {
      setSaveError("No se pudo guardar la pregunta. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!session || !quiz) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cuestionarios/${quiz.id}/preguntas/${questionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );
      if (!res.ok) throw new Error();
      setQuiz({ ...quiz, questions: quiz.questions.filter((q) => q.id !== questionId) });
    } catch {
      setSaveError("No se pudo borrar la pregunta. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReorder(index: number, direction: -1 | 1) {
    if (!session || !quiz) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= quiz.questions.length) return;

    const reordered = [...quiz.questions];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cuestionarios/${quiz.id}/orden`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question_ids: reordered.map((q) => q.id) }),
        },
      );
      if (!res.ok) throw new Error();
      setQuiz({
        ...quiz,
        questions: reordered.map((q, i) => ({ ...q, order_index: i })),
      });
    } catch {
      setSaveError("No se pudo reordenar. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!quiz) {
    return (
      <form onSubmit={handleCreateQuiz} className="flex flex-col gap-3 max-w-md">
        <p className="text-sm text-ink-soft">Este curso todavía no tiene cuestionario.</p>
        <label className="block text-sm font-medium">
          Título del cuestionario
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        {saveError && <p className="text-sm text-red-500">{saveError}</p>}
        <Button type="submit" disabled={saving || !newTitle.trim()} className="w-fit">
          Crear cuestionario
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-lg font-bold uppercase">{quiz.title}</h3>

      <div className="flex flex-col gap-3">
        {quiz.questions.map((question, index) => (
          <Card key={question.id} className="font-sans">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              {editingId === question.id ? (
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleUpdateQuestion(question.id)}
                      disabled={saving}
                    >
                      Guardar
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <CardTitle className="flex-1 text-base font-normal">
                  {question.question_text}
                </CardTitle>
              )}

              {editingId !== question.id && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleReorder(index, -1)}
                    disabled={saving || index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleReorder(index, 1)}
                    disabled={saving || index === quiz.questions.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(question.id);
                      setEditingText(question.question_text);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={saving}
                  >
                    Borrar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={handleAddQuestion} className="flex flex-col gap-3 max-w-md">
        <label className="block text-sm font-medium">
          Nueva pregunta
          <input
            type="text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        {saveError && <p className="text-sm text-red-500">{saveError}</p>}
        <Button type="submit" disabled={saving || !newQuestionText.trim()} className="w-fit">
          Agregar pregunta
        </Button>
      </form>
    </div>
  );
}
