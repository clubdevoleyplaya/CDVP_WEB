"use client";

import { useEffect, useState } from "react";

import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";

type Question = { id: string; question_text: string; order_index: number; answer: string | null };
type Quiz = { id: string; title: string; questions: Question[] };

type QuizSectionProps = { slug: string; category: Category };

export function QuizSection({ slug, category }: QuizSectionProps) {
  const { session } = useDemoState();
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errorByQuestion, setErrorByQuestion] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!session || category !== "curso") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cuestionarios/${slug}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setQuiz(data.quiz);
        if (data.quiz) {
          const initial: Record<string, string> = {};
          for (const question of data.quiz.questions as Question[]) {
            initial[question.id] = question.answer ?? "";
          }
          setAnswers(initial);
        }
      })
      .catch(() => setQuiz(null));
  }, [session, category, slug]);

  if (!quiz) return null;

  async function saveAnswer(questionId: string) {
    if (!session) return;
    setErrorByQuestion((prev) => ({ ...prev, [questionId]: "" }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cuestionarios/${slug}/respuestas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ question_id: questionId, answer: answers[questionId] ?? "" }),
        }
      );
      if (!res.ok) throw new Error("no se pudo guardar");
    } catch {
      setErrorByQuestion((prev) => ({
        ...prev,
        [questionId]: "No se pudo guardar tu respuesta. Probá de nuevo.",
      }));
    }
  }

  return (
    <div className="mt-8 max-w-2xl space-y-6">
      <h2 className="font-display text-xl font-bold uppercase">{quiz.title}</h2>
      {quiz.questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium">{question.question_text}</label>
          <textarea
            value={answers[question.id] ?? ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
            }
            onBlur={() => saveAnswer(question.id)}
            rows={3}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errorByQuestion[question.id] && (
            <p className="text-sm text-red-500">{errorByQuestion[question.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
