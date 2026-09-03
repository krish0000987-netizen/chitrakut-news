// Polyfill Promise.withResolvers for browsers that don't support it natively yet (Required for pdfjs-dist v4)
if (typeof window !== 'undefined' && typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

let pdfjsLibPromise: Promise<any> | null = null;

async function getPdfJs() {
  if (typeof window === 'undefined') return null;
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import('pdfjs-dist').then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
      return lib;
    }).catch(err => {
      console.warn('Could not load pdfjs-dist dynamically:', err);
      return null;
    });
  }
  return pdfjsLibPromise;
}

/**
 * Loads a PDF Document from URL, File, or ArrayBuffer with multi-tier CORS resilience
 */
async function loadPdfDoc(pdfSource: string | ArrayBuffer | File | Uint8Array) {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error('PDF.js library not available');

  if (pdfSource instanceof File) {
    const data = await pdfSource.arrayBuffer();
    return await pdfjs.getDocument({ data }).promise;
  } else if (pdfSource instanceof ArrayBuffer || pdfSource instanceof Uint8Array) {
    return await pdfjs.getDocument({ data: pdfSource }).promise;
  } else if (typeof pdfSource === 'string') {
    // Tier 1: Direct URL
    try {
      return await pdfjs.getDocument({ 
        url: pdfSource,
        withCredentials: false,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
        cMapPacked: true
      }).promise;
    } catch (directErr) {
      console.warn('Tier 1 PDF load failed, trying Tier 2 (fetch arrayBuffer):', directErr);
    }

    // Tier 2: Fetch ArrayBuffer
    try {
      const res = await fetch(pdfSource);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.arrayBuffer();
      return await pdfjs.getDocument({ data }).promise;
    } catch (fetchErr) {
      console.warn('Tier 2 PDF fetch failed, trying Tier 3 (CORS proxy):', fetchErr);
    }

    // Tier 3: CORS Proxy
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pdfSource)}`;
      const res = await fetch(proxyUrl);
      const data = await res.arrayBuffer();
      return await pdfjs.getDocument({ data }).promise;
    } catch (proxyErr) {
      console.error('All PDF load tiers failed:', proxyErr);
      throw proxyErr;
    }
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
  try {
    const pdfDoc = await loadPdfDoc(pdfSource);
    const numPages = pdfDoc.numPages;
    const safePageNum = Math.min(Math.max(1, pageNumber), numPages);
    const page = await pdfDoc.getPage(safePageNum);

    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = targetWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
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

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/jpeg',
        0.92
      );
    });

    return { dataUrl, blob, numPages };
  } catch (err) {
    console.warn('generatePdfThumbnail error:', err);
    throw err;
  }
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
  const safePageNum = Math.min(Math.max(1, pageNumber), numPages);
  const page = await pdfDoc.getPage(safePageNum);

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
