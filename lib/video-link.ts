// Réplica en TS de CDVP_Api/app/services/video_link_service.py — mismo criterio
// de detección por dominio, sin código compartido entre los 2 repos.

export type VideoProvider = "vimeo" | "youtube";

export function detectVideoProvider(url: string): {
  provider: VideoProvider;
  videoId: string;
} {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`"${url}" no es un link de Vimeo ni de YouTube`);
  }
  const host = parsed.hostname.toLowerCase();

  if (host === "vimeo.com" || host === "www.vimeo.com") {
    const match = parsed.pathname.match(/^\/(\d+)/);
    if (match) return { provider: "vimeo", videoId: match[1] };
  }

  if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com") {
    const videoId = parsed.searchParams.get("v");
    if (videoId) return { provider: "youtube", videoId };
  }

  if (host === "youtu.be" || host === "www.youtu.be") {
    const videoId = parsed.pathname.replace(/^\//, "");
    if (videoId) return { provider: "youtube", videoId };
  }

  throw new Error(`"${url}" no es un link de Vimeo ni de YouTube`);
}
