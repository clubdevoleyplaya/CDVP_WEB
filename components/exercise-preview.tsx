import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VimeoPlayer } from "@/components/vimeo-player";
import { detectVideoProvider } from "@/lib/video-link";

import type { ExerciseFormValues } from "@/components/exercise-form";

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]+$/;
const HTTP_URL_RE = /^https?:\/\//i;

function parseVideo(videoUrl: string): { provider: "vimeo" | "youtube"; videoId: string } | null {
  if (!videoUrl.trim()) return null;
  try {
    return detectVideoProvider(videoUrl);
  } catch {
    return null;
  }
}

function safePhotoUrls(urls: string[]): string[] {
  const result: string[] = [];
  for (const url of urls) {
    if (HTTP_URL_RE.test(url)) {
      result.push(url);
    }
  }
  return result;
}

function VideoPreview({ videoUrl }: { videoUrl: string }) {
  const parsed = parseVideo(videoUrl);

  if (parsed?.provider === "youtube" && YOUTUBE_ID_RE.test(parsed.videoId)) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${parsed.videoId}`}
          title="Video del ejercicio"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  return <VimeoPlayer videoId={parsed?.provider === "vimeo" ? parsed.videoId : null} />;
}

export function ExercisePreview({ values }: { values: ExerciseFormValues }) {
  const pdfHref = HTTP_URL_RE.test(values.pdfUrl) ? values.pdfUrl : null;
  const photoUrls = safePhotoUrls(values.photoUrls);

  return (
    <Card className="font-sans">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wide text-ink-soft">
          Así lo ve el suscriptor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <VideoPreview videoUrl={values.videoUrl} />

        <h3 className="font-display text-lg font-bold">
          {values.title.trim() || "Título del ejercicio"}
        </h3>

        <p className="whitespace-pre-wrap text-sm text-ink-soft">
          {values.content.trim() || "El contenido del ejercicio aparece acá."}
        </p>

        {pdfHref && (
          <a
            href={pdfHref}
            target="_blank"
            rel="noreferrer"
            className="w-fit rounded-lg border border-line px-3 py-1.5 text-sm font-bold uppercase tracking-wide hover:bg-surface"
          >
            Ver PDF
          </a>
        )}

        {photoUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photoUrls.map((url, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={url}
                alt=""
                className="aspect-square w-full rounded-lg border border-line object-cover"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
