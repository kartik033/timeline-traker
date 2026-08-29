import { toPng } from 'html-to-image';

export async function exportElementAsImage(element, fileName = 'my-timeline.png') {
  if (!element) throw new Error('No element provided to export.');

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#0f1220',
  });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}