// file path: public/snapshotWorker.js
self.onmessage = async (event) => {
  const { slideId, imageData, scale = 0.25 } = event.data;

  try {
    // Create a bitmap from the image data
    const response = await fetch(imageData);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    // Create scaled canvas
    const scaledWidth = bitmap.width * scale;
    const scaledHeight = bitmap.height * scale;
    const canvas = new OffscreenCanvas(scaledWidth, scaledHeight);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Draw scaled image
    ctx.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);
    
    // Convert to blob
    const resultBlob = await canvas.convertToBlob({ type: 'image/png' });
    
    // Convert blob to base64
    const reader = new FileReader();
    const snapshot = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(resultBlob);
    });

    // Clean up
    bitmap.close();

    self.postMessage({ 
      success: true, 
      snapshot,
      slideId
    });
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      slideId
    });
  }
};