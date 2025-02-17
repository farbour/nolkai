// file path: public/snapshotWorker.js
self.onmessage = async (event) => {
  const { slideId, imageData, scale = 0.25 } = event.data;

  try {
    // Create a bitmap from the image data
    const response = await fetch(imageData);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    // Create scaled canvas
    const scaledWidth = Math.round(bitmap.width * scale);
    const scaledHeight = Math.round(bitmap.height * scale);
    const canvas = new OffscreenCanvas(scaledWidth, scaledHeight);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw scaled image
    ctx.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);
    
    // Get the image data URL directly from canvas
    const snapshot = canvas.toDataURL('image/png', 0.8);
    
    // Clean up
    bitmap.close();

    // Send the scaled image back
    self.postMessage({ 
      success: true, 
      snapshot,
      slideId
    });
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      slideId
    });
  }
};