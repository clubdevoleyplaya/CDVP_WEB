"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoState } from "@/context/demo-state";
import { createClient } from "@/lib/supabase/client";

type CourseAccess = { slug: string; title: string; has_access: boolean };

export default function PerfilPage() {
  const { session, me, isSubscriber, signOut, updateProfile, setLoginOpen } = useDemoState();

  const [courses, setCourses] = useState<CourseAccess[]>([]);
  const [nickname, setNickname] = useState("");
  const [team, setTeam] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!me) return;
    setNickname(me.nickname ?? "");
    setTeam(me.team ?? "");
    setBio(me.bio ?? "");
  }, [me]);

  useEffect(() => {
    if (!session) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/courses`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [session]);

  if (!session) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold uppercase">Tu perfil</h1>
        <p className="mt-4 text-sm text-ink-soft">Iniciá sesión para ver tu perfil.</p>
        <Button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="mt-6 font-display text-xs font-bold uppercase tracking-wide"
        >
          Iniciar sesión
        </Button>
      </section>
    );
  }

  const displayName = me?.nickname || session.user.user_metadata?.full_name || session.user.email;
  const initial = (displayName ?? "?").charAt(0).toUpperCase();
  const accessCount = courses.filter((c) => c.has_access).length;

  async function handleSaveProfile() {
    setSaving(true);
    try {
      await updateProfile({ nickname, team, bio });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${session.user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await updateProfile({ avatarUrl: data.publicUrl });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="relative h-52 bg-gradient-to-r from-blue via-green to-yellow">
          <label className="group absolute -bottom-10 left-8 flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface font-display text-3xl font-bold text-ink">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              initial
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
            <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-[10px] font-bold uppercase text-white group-hover:flex">
              {uploading ? "..." : "Cambiar"}
            </span>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface px-8 pt-16 pb-8">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase">{displayName}</h1>
            {me?.team && <p className="mt-1 text-sm text-ink-soft">{me.team}</p>}
          </div>
          <Badge variant={isSubscriber ? "default" : "outline"}>
            {isSubscriber ? "Suscriptor" : "Sin suscripción"}
          </Badge>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <Card className="font-sans">
          <CardHeader>
            <CardTitle>Sobre mí</CardTitle>
            <CardDescription>Equipo, apodo y biografía visibles en tu perfil.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="team">Equipo</Label>
              <Input
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Ej. Beach Volley Lab"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nickname">Apodo (opcional)</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Cómo te dicen en la cancha"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Biografía</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Contanos un poco de vos"
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <Button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-fit font-display text-xs font-bold uppercase tracking-wide"
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>Mis cursos</CardTitle>
              <CardDescription>
                {accessCount} de {courses.length} con acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {courses.map((course) => (
                <div key={course.slug} className="flex items-center justify-between gap-2 text-sm">
                  <span className={course.has_access ? "" : "text-ink-soft"}>{course.title}</span>
                  {course.has_access ? (
                    <Check className="size-4 text-green" />
                  ) : (
                    <Lock className="size-4 text-ink-soft" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {me?.role === "admin" && (
            <Card className="font-sans border-blue">
              <CardHeader>
                <CardTitle>Panel admin</CardTitle>
                <CardDescription>Ventas, visitas y métricas del sitio.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/analytics"
                  className="font-display text-xs font-bold uppercase tracking-wide text-blue underline"
                >
                  Ver analíticas
                </Link>
              </CardContent>
            </Card>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => signOut()}
            className="w-fit font-display text-xs font-bold uppercase tracking-wide"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </section>
  );
}
