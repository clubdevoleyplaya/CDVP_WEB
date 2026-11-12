"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
import { getProductBySlug } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

const MAX_BANNER_BYTES = 5 * 1024 * 1024;


export default function PerfilPage() {
  const t = useTranslations("Profile");
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
      setBannerError(t("bannerNotImage"));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      setBannerError(t("bannerTooBig"));
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
      setBannerError(t("bannerUploadError"));
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
      setBannerError(t("bannerRemoveError"));
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
                ? t("uploading")
                : me?.bannerUrl
                  ? t("changeBanner")
                  : t("uploadBanner")}
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
                aria-label={t("removeBanner")}
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
              {uploading ? "..." : t("change")}
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
              {displayName || t("noNickname")}
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
                : "border-yellow bg-yellow text-navy hover:opacity-90"
            }
          >
            {isSubscriber ? t("subscriber") : t("noSubscription")}
          </Badge>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {me ? (
          <ProfileForm me={me} onSave={updateProfile} />
        ) : (
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>{t("aboutMe")}</CardTitle>
              <CardDescription>{t("loading")}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="flex flex-col gap-4">
          <Card className="font-sans">
            <CardHeader>
              <CardTitle>{t("myCourses")}</CardTitle>
              <CardDescription>
                {coursesLoading
                  ? t("loading")
                  : coursesError
                    ? t("coursesError")
                    : t("coursesCount", { access: accessCount, total: courses.length })}
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
                  {t("coursesErrorLong")}
                </p>
              ) : (
                courses.map((course) => {
                  const image = getProductBySlug(course.slug)?.image;
                  return (
                    <Link
                      key={course.slug}
                      href={course.has_access ? `/curso/${course.slug}` : `/producto/${course.slug}`}
                      className="flex items-center gap-3 rounded-md p-1 text-sm hover:bg-surface"
                    >
                      {image && (
                        <Image src={image} alt="" width={48} height={48} className="size-12 shrink-0 rounded-md object-cover" />
                      )}
                      <span className={`flex-1 ${course.has_access ? "font-medium" : "text-ink-soft"}`}>
                        {course.title}
                      </span>
                      {course.has_access ? (
                        <Check className="size-4 text-green" />
                      ) : (
                        <Lock className="size-4 text-ink-soft" />
                      )}
                    </Link>
                  );
                })
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
              {t("adminPanel")}
            </Link>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => signOut()}
            className="w-fit font-display text-xs font-bold uppercase tracking-wide"
          >
            {t("signOut")}
          </Button>
        </div>
      </div>
    </section>
  );
}

function SubscriptionCard({ onCancel }: { onCancel: () => Promise<void> }) {
  const t = useTranslations("Profile");
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!window.confirm(t("cancelConfirm"))) return;
    setCanceling(true);
    setError(null);
    try {
      await onCancel();
    } catch {
      setError(t("cancelError"));
    } finally {
      setCanceling(false);
    }
  }

  return (
    <Card className="font-sans">
      <CardHeader>
        <CardTitle>{t("subscription")}</CardTitle>
        <CardDescription>{t("subscribedToClub")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={canceling}
          className="w-fit font-display text-xs font-bold uppercase tracking-wide text-destructive hover:border-destructive"
        >
          {canceling ? t("canceling") : t("cancel")}
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
  const t = useTranslations("Profile");
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
        <CardTitle>{t("aboutMe")}</CardTitle>
        <CardDescription>{t("aboutMeDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="team">{t("team")}</Label>
          <Input
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder={t("teamPlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nickname">{t("nickname")}</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t("nicknamePlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">{t("bio")}</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder={t("bioPlaceholder")}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <Button
          type="button"
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-fit font-display text-xs font-bold uppercase tracking-wide"
        >
          {saving ? t("saving") : t("save")}
        </Button>
      </CardContent>
    </Card>
  );
}
