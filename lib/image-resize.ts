// Reduce una imagen en el navegador antes de subirla: las fotos de celular pesan varios MB y el
// avatar se muestra en 24-96 px en cada página. Devuelve WebP; si algo falla, el archivo original.

export async function shrinkImage(file: File, maxSide: number, quality = 0.82): Promise<File | Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}
