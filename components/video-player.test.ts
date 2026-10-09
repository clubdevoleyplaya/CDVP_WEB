import { describe, expect, it } from "vitest";

import { videoEmbedUrl } from "./video-player";

describe("videoEmbedUrl", () => {
  it("arma el iframe de Vimeo o de YouTube (sin cookies) según el proveedor", () => {
    expect(videoEmbedUrl("vimeo", "123")).toBe("https://player.vimeo.com/video/123");
    expect(videoEmbedUrl("youtube", "abc_-9")).toBe("https://www.youtube-nocookie.com/embed/abc_-9");
  });

  it("rechaza ids con caracteres que podrían salirse de la URL", () => {
    expect(videoEmbedUrl("vimeo", "1/../x")).toBeNull();
    expect(videoEmbedUrl("youtube", "a?autoplay=1")).toBeNull();
    expect(videoEmbedUrl("youtube", "")).toBeNull();
  });
});
