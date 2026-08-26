export function VimeoPlayer({ videoId }: { videoId: string | null }) {
  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-line bg-surface font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
        Video próximamente
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface">
      <iframe
        className="h-full w-full"
        src={`https://player.vimeo.com/video/${videoId}`}
        title="Video del curso"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
