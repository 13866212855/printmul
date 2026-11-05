import { PageItem } from '../types';

export function readImageAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = dataUrl;
  });
}

export async function parseImageFile(
  file: File,
  fileId: string
): Promise<{ pages: PageItem[]; pageCount: number; thumbnail: string }> {
  const dataUrl = await readImageAsDataUrl(file);
  const { width, height } = await getImageDimensions(dataUrl);

  const aspectRatio = width / (height || 1);
  const orientation = aspectRatio > 1.25 ? 'landscape' : 'portrait';

  const page: PageItem = {
    id: `${fileId}-img-p1`,
    fileId,
    fileName: file.name,
    fileType: 'image',
    pageIndex: 0,
    totalInFile: 1,
    globalIndex: 0,
    aspectRatio,
    orientation,
    renderType: 'image',
    dataUrl,
  };

  return {
    pages: [page],
    pageCount: 1,
    thumbnail: dataUrl,
  };
}
