import type { VideoProvider } from "@/lib/video-link";

const VIDEO_ID_RE = /^[A-Za-z0-9_-]+$/;

export function videoEmbedUrl(provider: VideoProvider, videoId: string): string | null {
  if (!VIDEO_ID_RE.test(videoId)) return null;
  return provider === "vimeo"
    ? `https://player.vimeo.com/video/${videoId}`
    : `https://www.youtube-nocookie.com/embed/${videoId}`;
}

type VideoPlayerProps = {
  provider: VideoProvider | null;
  videoId: string | null;
  // Marca de agua: el email de quien mira, para rastrear un video filtrado hasta la cuenta.
  watermark?: string | null;
};

export function VideoPlayer({ provider, videoId, watermark }: VideoPlayerProps) {
  const src = provider && videoId ? videoEmbedUrl(provider, videoId) : null;

  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-line bg-surface font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
        Video próximamente
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface">
      <iframe
        className="h-full w-full"
        src={src}
        title="Video del curso"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        allowFullScreen
      />
      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 select-none rounded bg-black/20 px-2 py-0.5 text-[11px] text-white/50"
        >
          {watermark}
        </span>
      )}
    </div>
  );
}
