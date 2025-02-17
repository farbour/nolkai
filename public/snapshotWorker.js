// file path: public/snapshotWorker.js
importScripts('https://html2canvas.hertzen.com/dist/html2canvas.min.js');

self.onmessage = async (event) => {
  const { slideId, imageData } = event.data;

  try {
    // Create a canvas from the image data
    const img = new Image();
    img.src = imageData;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Scale down the image
    const scale = 0.25;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    const scaledCanvas = new OffscreenCanvas(scaledWidth, scaledHeight);
    const scaledCtx = scaledCanvas.getContext('2d');
    
    if (!scaledCtx) {
      throw new Error('Could not get scaled canvas context');
    }

    scaledCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    
    // Convert to blob and then to base64
    const blob = await scaledCanvas.convertToBlob({ type: 'image/png' });
    const reader = new FileReader();
    
    const snapshot = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

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