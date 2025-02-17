// file path: src/utils/slideSnapshot.ts
import html2canvas from 'html2canvas';

export async function captureSlideSnapshot(slideElement: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(slideElement, {
      scale: 0.25, // Scale down for thumbnail
      backgroundColor: 'white',
      logging: false,
      useCORS: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing slide snapshot:', error);
    return '';
  }
}