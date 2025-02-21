import * as pdfjsLib from 'pdfjs-dist';

// Initialize worker
async function initializeWorker() {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
      const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
    } catch (error) {
      console.warn('Failed to load PDF worker, falling back to main thread:', error);
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    }
  }
}

export async function extractPdfContent(file: File): Promise<{ text: string; name: string }> {
  try {
    console.log('Starting PDF extraction for:', file.name);
    
    // Initialize worker before processing
    await initializeWorker();
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to ArrayBuffer');
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false,
      useWorkerFetch: false,
      disableFontFace: true
    });
    console.log('PDF loading task created');
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, number of pages:', pdf.numPages);
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    console.log('PDF extraction completed');
    return {
      text: fullText.trim(),
      name: file.name
    };
  } catch (error) {
    console.error('Error in PDF extraction:', error);
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
} 