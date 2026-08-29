import { toPng } from 'html-to-image';

export async function generateTimelineImage(element) {
  if (!element) throw new Error('No element provided to export.');
  return toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#0f1220',
  });
}

export function dataUrlToFile(dataUrl, fileName) {
  const [meta, base64] = dataUrl.split(',');
  const mime = meta.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], fileName, { type: mime });
}

export function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

export async function shareOrGetImage(element, fileName = 'my-timeline.png') {
  const dataUrl = await generateTimelineImage(element);
  const file = dataUrlToFile(dataUrl, fileName);

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My Timeline',
        text: 'Check out my timeline progress!',
      });
      return { shared: true, dataUrl };
    } catch (err) {
      if (err.name === 'AbortError') return { shared: false, cancelled: true, dataUrl };
    }
  }

  return { shared: false, dataUrl };
}