import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker using unpkg or cdnjs fallback to guarantee it works in Vite bundles and browser
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

/**
 * Loads a PDF Document from URL, File, or ArrayBuffer
 */
async function loadPdfDoc(pdfSource: string | ArrayBuffer | File | Uint8Array) {
  let data: any;

  if (pdfSource instanceof File) {
    data = await pdfSource.arrayBuffer();
    return await pdfjsLib.getDocument({ data }).promise;
  } else if (pdfSource instanceof ArrayBuffer || pdfSource instanceof Uint8Array) {
    return await pdfjsLib.getDocument({ data: pdfSource }).promise;
  } else if (typeof pdfSource === 'string') {
    return await pdfjsLib.getDocument({ url: pdfSource }).promise;
  }
  throw new Error('Unsupported PDF source type');
}

/**
 * Extracts page 1 (or any page) as a DataURL and Blob (JPEG) to use as cover thumbnail
 */
export async function generatePdfThumbnail(
  pdfSource: string | ArrayBuffer | File | Uint8Array,
  pageNumber: number = 1,
  targetWidth: number = 800
): Promise<{ dataUrl: string; blob: Blob; numPages: number }> {
  const pdfDoc = await loadPdfDoc(pdfSource);
  const numPages = pdfDoc.numPages;
  const page = await pdfDoc.getPage(Math.min(pageNumber, numPages));

  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Fill white background before rendering
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/jpeg',
      0.9
    );
  });

  return { dataUrl, blob, numPages };
}

/**
 * Renders a specific page onto an existing HTML Canvas element
 */
export async function renderPdfPageToCanvas(
  pdfSource: string | ArrayBuffer | File | Uint8Array,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<{ width: number; height: number; numPages: number }> {
  const pdfDoc = await loadPdfDoc(pdfSource);
  const numPages = pdfDoc.numPages;
  const page = await pdfDoc.getPage(Math.min(Math.max(1, pageNumber), numPages));

  const viewport = page.getViewport({ scale });
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return { width: viewport.width, height: viewport.height, numPages };
}
