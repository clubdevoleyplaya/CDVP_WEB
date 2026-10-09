"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Check, ImagePlus, Lock, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/components/auth-guard";
import { useDemoState } from "@/context/demo-state";
import type { CourseAccess } from "@/lib/course-access";
import { createClient } from "@/lib/supabase/client";

const MAX_BANNER_BYTES = 5 * 1024 * 1024;


export default function PerfilPage() {
  const { session, me, isSubscriber, signOut, updateProfile, cancelSubscription } = useDemoState();

  const [courses, setCourses] = useState<CourseAccess[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/courses`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setCourses)
      .catch(() => setCoursesError(true))
      .finally(() => setCoursesLoading(false));
  }, [session]);

  if (!session) {
    return <AuthGuard>{null}</AuthGuard>;
  }

  const displayName = me?.nickname;
  const initialSource =
    displayName || session.user.user_metadata?.full_name || session.user.email;
  const initial = (initialSource ?? "?").charAt(0).toUpperCase();
  const accessCount = courses.filter((c) => c.has_access).length;

  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${session.user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await updateProfile({ avatarUrl: data.publicUrl });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleBannerUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setBannerError(null);
    if (!file.type.startsWith("image/")) {
      setBannerError("El archivo tiene que ser una imagen (JPG, PNG o WebP).");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      setBannerError("La imagen pesa más de 5 MB. Elegí una más liviana.");
      e.target.value = "";
      return;
    }
    setBannerUploading(true);
    try {
      const supabase = createClient();
      const path = `${session.user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("banners")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("banners").getPublicUrl(path);
      await updateProfile({ bannerUrl: data.publicUrl });
    } catch {
      setBannerError("No se pudo subir el banner. Probá de nuevo.");
    } finally {
      setBannerUploading(false);
      e.target.value = "";
    }
  }

  async function handleBannerRemove() {
    setBannerError(null);
    try {
      await updateProfile({ bannerUrl: null });
    } catch {
      setBannerError("No se pudo quitar el banner. Probá de nuevo.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="relative h-52 bg-gradient-to-r from-blue via-green to-yellow">
          {me?.bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={me.bannerUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-wide text-white hover:bg-black/70">
              <ImagePlus className="size-3.5" />
              {bannerUploading
                ? "Subiendo..."
                : me?.bannerUrl
                  ? "Cambiar banner"
                  : "Subir banner"}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                disabled={bannerUploading}
                className="hidden"
              />
            </label>
            {me?.bannerUrl && (
              <button
                type="button"
                onClick={handleBannerRemove}
                aria-label="Quitar banner"
                className="flex items-center rounded-full bg-black/50 px-2 text-white hover:bg-black/70"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <label className="group absolute -bottom-10 left-8 flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface font-display text-3xl font-bold text-ink">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.avatarUrl}
                alt=""
                className="size-full object-cover"
              />
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
        {bannerError && (
          <p className="bg-surface px-8 pt-3 text-sm text-destructive">
            {bannerError}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface px-8 pt-16 pb-8">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase">
              {displayName || "Sin apodo"}
            </h1>
            {me?.team && (
              <p className="mt-1 text-sm text-ink-soft">{me.team}</p>
            )}
          </div>
          <Badge
            variant={isSubscriber ? "default" : "outline"}
            render={isSubscriber ? undefined : <Link href="/suscripcion" />}
            className={
              isSubscriber
                ? undefined
                : "border-yellow bg-yellow text-white hover:opacity-90"
            }
          >
            {isSubscriber ? "Suscriptor" : "Sin suscripción"}
          </Badge>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {me ? (
          <ProfileForm me={me} onSave={updateProfile} />
        ) : (
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>Sobre mí</CardTitle>
              <CardDescription>Cargando...</CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="flex flex-col gap-4">
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>Mis cursos</CardTitle>
              <CardDescription>
                {coursesLoading
                  ? "Cargando..."
                  : coursesError
                    ? "No se pudieron cargar tus cursos."
                    : `${accessCount} de ${courses.length} con acceso`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {coursesLoading ? (
                <>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </>
              ) : coursesError ? (
                <p className="text-sm text-ink-soft">
                  Hubo un error al traer tus cursos. Probá de nuevo más tarde.
                </p>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.slug}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className={course.has_access ? "" : "text-ink-soft"}>
                      {course.title}
                    </span>
                    {course.has_access ? (
                      <Check className="size-4 text-green" />
                    ) : (
                      <Lock className="size-4 text-ink-soft" />
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {isSubscriber && <SubscriptionCard onCancel={cancelSubscription} />}

          {me?.role === "admin" && (
            <Link
              href="/admin/analytics"
              className={buttonVariants({
                className: "w-fit font-display text-xs font-bold uppercase tracking-wide",
              })}
            >
              Panel admin
            </Link>
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

function SubscriptionCard({ onCancel }: { onCancel: () => Promise<void> }) {
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!window.confirm("¿Seguro que querés cancelar tu suscripción?")) return;
    setCanceling(true);
    setError(null);
    try {
      await onCancel();
    } catch {
      setError("No se pudo cancelar la suscripción. Probá de nuevo.");
    } finally {
      setCanceling(false);
    }
  }

  return (
    <Card className="font-sans">
      <CardHeader>
        <CardTitle>Suscripción</CardTitle>
        <CardDescription>Estás suscripto al club.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={canceling}
          className="w-fit font-display text-xs font-bold uppercase tracking-wide text-destructive hover:border-destructive"
        >
          {canceling ? "Cancelando..." : "Cancelar suscripción"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

function ProfileForm({
  me,
  onSave,
}: {
  me: { nickname: string | null; team: string | null; bio: string | null };
  onSave: (fields: {
    nickname: string;
    team: string;
    bio: string;
  }) => Promise<void>;
}) {
  const [nickname, setNickname] = useState(me.nickname ?? "");
  const [team, setTeam] = useState(me.team ?? "");
  const [bio, setBio] = useState(me.bio ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      await onSave({ nickname, team, bio });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="font-sans">
      <CardHeader>
        <CardTitle>Sobre mí</CardTitle>
        <CardDescription>
          Equipo, apodo y biografía visibles en tu perfil.
        </CardDescription>
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
  );
}
