import { supabase } from '../lib/supabase';

export interface DbEpaper {
  id: string;
  title: string;
  title_hi?: string;
  edition_date: string;
  edition_type: string; // 'daily' | 'evening' | 'weekly' | 'special'
  city_edition?: string; // 'चित्रकूट' | 'भोपाल' | 'सतना' | 'रीवा' | 'ग्वालियर' | 'इंदौर' | 'जबलपुर'
  description?: string;
  pdf_storage_path: string;
  pdf_public_url?: string;
  cover_image_path?: string;
  cover_public_url?: string;
  page_images?: string[];
  file_size?: number;
  page_count?: number;
  language: string;
  status: string;
  is_featured: boolean;
  views_count: number;
  downloads_count: number;
  published_at?: string;
  created_at: string;
  updated_at?: string;
}

export const CITIES_EDITIONS = [
  { id: 'all', name: 'सभी संस्करण', name_en: 'All Editions' },
  { id: 'chitrakoot', name: 'चित्रकूट (मुख्य)', name_en: 'Chitrakoot' },
  { id: 'bhopal', name: 'भोपाल', name_en: 'Bhopal' },
  { id: 'satna', name: 'सतना', name_en: 'Satna' },
  { id: 'rewa', name: 'रीवा', name_en: 'Rewa' },
  { id: 'gwalior', name: 'ग्वालियर', name_en: 'Gwalior' },
  { id: 'indore', name: 'इंदौर', name_en: 'Indore' },
  { id: 'jabalpur', name: 'जबलपुर', name_en: 'Jabalpur' },
];

const LS_KEY = 'cj_epapers_db';

const SEED_EPAPERS: DbEpaper[] = [
  {
    id: 'ep-today-chitrakoot',
    title: 'दैनिक चित्रकूट ज्योति - चित्रकूट मुख्य संस्करण',
    title_hi: 'दैनिक चित्रकूट ज्योति - चित्रकूट मुख्य संस्करण',
    edition_date: new Date().toISOString().slice(0, 10),
    edition_type: 'daily',
    city_edition: 'चित्रकूट (मुख्य)',
    description: 'दैनिक चित्रकूट ज्योति का आज का ताजा मुख्य संस्करण। चित्रकूट धाम, सतना, बांदा एवं विंध्य क्षेत्र की प्रमुख खबरें।',
    pdf_storage_path: 'sample-chitrakoot.pdf',
    pdf_public_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    file_size: 4250000,
    page_count: 4,
    language: 'hi',
    status: 'published',
    is_featured: true,
    views_count: 1420,
    downloads_count: 320,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'ep-today-bhopal',
    title: 'दैनिक चित्रकूट ज्योति - भोपाल राज्य संस्करण',
    title_hi: 'दैनिक चित्रकूट ज्योति - भोपाल राज्य संस्करण',
    edition_date: new Date().toISOString().slice(0, 10),
    edition_type: 'daily',
    city_edition: 'भोपाल',
    description: 'भोपाल राजधानी विशेष संस्करण, मप्र शासन एवं मंत्रालय की विशेष खबरें।',
    pdf_storage_path: 'sample-bhopal.pdf',
    pdf_public_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    file_size: 3840000,
    page_count: 4,
    language: 'hi',
    status: 'published',
    is_featured: false,
    views_count: 980,
    downloads_count: 180,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'ep-today-satna',
    title: 'दैनिक चित्रकूट ज्योति - सतना जिला संस्करण',
    title_hi: 'दैनिक चित्रकूट ज्योति - सतना जिला संस्करण',
    edition_date: new Date().toISOString().slice(0, 10),
    edition_type: 'daily',
    city_edition: 'सतना',
    description: 'सतना, मैहर एवं आसपास के अंचल की विशेष खबरें।',
    pdf_storage_path: 'sample-satna.pdf',
    pdf_public_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    file_size: 3120000,
    page_count: 4,
    language: 'hi',
    status: 'published',
    is_featured: false,
    views_count: 650,
    downloads_count: 110,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'ep-today-rewa',
    title: 'दैनिक चित्रकूट ज्योति - रीवा विंध्य संस्करण',
    title_hi: 'दैनिक चित्रकूट ज्योति - रीवा विंध्य संस्करण',
    edition_date: new Date().toISOString().slice(0, 10),
    edition_type: 'daily',
    city_edition: 'रीवा',
    description: 'रीवा, सीधी, सिंगरौली एवं विंध्य अंचल की मुख्य खबरें।',
    pdf_storage_path: 'sample-rewa.pdf',
    pdf_public_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    file_size: 3400000,
    page_count: 4,
    language: 'hi',
    status: 'published',
    is_featured: false,
    views_count: 540,
    downloads_count: 95,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

function sanitizeItem(item: DbEpaper): DbEpaper {
  if (item.cover_public_url && item.cover_public_url.includes('unsplash.com')) {
    delete item.cover_public_url;
  }
  if (item.page_images) {
    item.page_images = item.page_images.filter(img => !img.includes('unsplash.com'));
    if (item.page_images.length === 0) delete item.page_images;
  }
  return item;
}

function getLocal(): DbEpaper[] {
  try {
    const r = localStorage.getItem(LS_KEY);
    if (!r) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED_EPAPERS));
      return SEED_EPAPERS.map(sanitizeItem);
    }
    const parsed = JSON.parse(r);
    return parsed.length > 0 ? parsed.map(sanitizeItem) : SEED_EPAPERS.map(sanitizeItem);
  } catch {
    return SEED_EPAPERS.map(sanitizeItem);
  }
}

function setLocal(d: DbEpaper[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(d.map(sanitizeItem)));
  } catch {}
}

async function trySupabase<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const m = e?.message || e?.details || e?.hint || JSON.stringify(e || '');
    if (
      m.includes('Could not find') ||
      m.includes('schema cache') ||
      m.includes('column') ||
      m.includes('table') ||
      m.includes('Failed to fetch') ||
      m.includes('placeholder')
    ) {
      console.warn('Supabase fallback triggered:', m);
      return fallback;
    }
    console.warn('Supabase error, returning fallback:', e);
    return fallback;
  }
}

export const epapersService = {
  async list(params?: { status?: string; featured?: boolean; city?: string; date?: string; limit?: number }) {
    return trySupabase(async () => {
      let q = supabase.from('epapers').select('*').order('edition_date', { ascending: false });
      if (params?.status) q = q.eq('status', params.status);
      if (params?.featured !== undefined) q = q.eq('is_featured', params.featured);
      if (params?.date) q = q.eq('edition_date', params.date);
      if (params?.limit) q = q.limit(params.limit);
      const { data, error } = await q;
      if (error) throw error;
      
      let res = (data && data.length > 0) ? (data as DbEpaper[]) : getLocal();
      if (params?.city && params.city !== 'all') {
        res = res.filter(x => x.city_edition === params.city || x.title?.includes(params.city) || (params.city === 'चित्रकूट' && !x.city_edition));
      }
      return res;
    }, (() => {
      let d = getLocal();
      if (params?.status) d = d.filter(x => x.status === params.status);
      if (params?.featured !== undefined) d = d.filter(x => x.is_featured === params.featured);
      if (params?.city && params.city !== 'all') d = d.filter(x => x.city_edition === params.city || x.title?.includes(params.city) || (params.city === 'चित्रकूट' && !x.city_edition));
      if (params?.date) d = d.filter(x => x.edition_date === params.date);
      if (params?.limit) d = d.slice(0, params.limit);
      return d;
    })());
  },

  async getFeatured() {
    return trySupabase(async () => {
      const { data, error } = await supabase
        .from('epapers')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('edition_date', { ascending: false })
        .limit(1)
        .single();
      if (error) return null;
      return data as DbEpaper;
    }, getLocal().find(x => x.is_featured && x.status === 'published') || getLocal()[0] || null);
  },

  async getById(id: string) {
    return trySupabase(async () => {
      const { data, error } = await supabase.from('epapers').select('*').eq('id', id).single();
      if (error) throw error;
      return data as DbEpaper;
    }, getLocal().find(x => x.id === id) as DbEpaper || getLocal()[0]);
  },

  async create(payload: Partial<DbEpaper>) {
    const local = getLocal();
    const n: DbEpaper = {
      id: 'ep-' + Date.now(),
      title: payload.title || 'ई-पेपर',
      title_hi: payload.title_hi || payload.title,
      edition_date: payload.edition_date || new Date().toISOString().slice(0, 10),
      edition_type: payload.edition_type || 'daily',
      city_edition: payload.city_edition || 'चित्रकूट (मुख्य)',
      description: payload.description || '',
      pdf_storage_path: payload.pdf_storage_path || '',
      pdf_public_url: payload.pdf_public_url,
      cover_image_path: payload.cover_image_path,
      cover_public_url: payload.cover_public_url,
      page_images: payload.page_images || (payload.cover_public_url ? [payload.cover_public_url] : []),
      file_size: payload.file_size,
      page_count: payload.page_count || 4,
      language: payload.language || 'hi',
      status: payload.status || 'published',
      is_featured: !!payload.is_featured,
      views_count: 0,
      downloads_count: 0,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    local.unshift(n);
    setLocal(local);

    // Try inserting to Supabase, but only with columns that match standard schema
    try {
      // Clean payload for standard Supabase columns
      const supabasePayload = {
        title: n.title,
        title_hi: n.title_hi,
        edition_date: n.edition_date,
        edition_type: n.edition_type,
        description: n.description,
        pdf_storage_path: n.pdf_storage_path,
        pdf_public_url: n.pdf_public_url,
        cover_image_path: n.cover_image_path,
        cover_public_url: n.cover_public_url,
        file_size: n.file_size,
        page_count: n.page_count,
        language: n.language,
        status: n.status,
        is_featured: n.is_featured,
        views_count: 0,
        downloads_count: 0,
        published_at: n.published_at,
        created_at: n.created_at
      };

      const { data, error } = await supabase.from('epapers').insert(supabasePayload).select().single();
      if (!error && data) {
        return { ...n, ...data };
      }
    } catch (err) {
      console.warn('Supabase create notice (saved to local database):', err);
    }

    return n;
  },

  async update(id: string, payload: Partial<DbEpaper>) {
    const local = getLocal();
    const idx = local.findIndex(x => x.id === id);
    if (idx >= 0) {
      local[idx] = { ...local[idx], ...payload } as DbEpaper;
      setLocal(local);
    }

    try {
      const { data, error } = await supabase
        .from('epapers')
        .update({ ...payload, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as DbEpaper;
    } catch {}

    return (idx >= 0 ? local[idx] : payload) as DbEpaper;
  },

  async remove(id: string) {
    setLocal(getLocal().filter(x => x.id !== id));
    try {
      await supabase.from('epapers').delete().eq('id', id);
    } catch {}
  },

  async uploadPdf(file: File, coverFile?: File) {
    try {
      const pdfName = `epapers/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: pdfErr } = await supabase.storage
        .from('epapers')
        .upload(pdfName, file, { contentType: 'application/pdf' });
      if (pdfErr) throw pdfErr;
      const { data: pdfUrl } = supabase.storage.from('epapers').getPublicUrl(pdfName);

      let coverUrl: string | undefined;
      let coverPath: string | undefined;
      if (coverFile) {
        const coverName = `epapers/covers/${Date.now()}-${coverFile.name.replace(/\s+/g, '-')}`;
        const { error: covErr } = await supabase.storage.from('epapers').upload(coverName, coverFile);
        if (covErr) throw covErr;
        const { data } = supabase.storage.from('epapers').getPublicUrl(coverName);
        coverUrl = data.publicUrl;
        coverPath = coverName;
      }
      return { pdfPath: pdfName, pdfUrl: pdfUrl.publicUrl, coverPath, coverUrl, fileSize: file.size };
    } catch {
      const pdfUrl = URL.createObjectURL(file);
      let coverUrl: string | undefined;
      let coverPath: string | undefined;
      if (coverFile) {
        coverUrl = URL.createObjectURL(coverFile);
        coverPath = 'local-cover';
      }
      return { pdfPath: 'local/' + file.name, pdfUrl, coverPath, coverUrl, fileSize: file.size };
    }
  }
};

