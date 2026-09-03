import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { epapersService } from '../../services/epapers';
import { generatePdfThumbnail } from '../../lib/pdfHelper';
import { EpaperThumbnail } from '../../components/epaper/EpaperThumbnail';
import { Upload, Trash2, Eye, Download, Star, Newspaper, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

export const EpaperManager: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('चित्रकूट ज्योति – दैनिक मुख्य संस्करण');
  const [cityEdition, setCityEdition] = useState('चित्रकूट (मुख्य)');
  const [editionDate, setEditionDate] = useState(new Date().toISOString().slice(0, 10));
  const [pageCount, setPageCount] = useState(8);
  const [isFeatured, setIsFeatured] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [extractingThumbnail, setExtractingThumbnail] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [autoCoverUrl, setAutoCoverUrl] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await epapersService.list();
      setList(r);
    } catch {}
    setLoading(false);
  };
  useEffect(() => {
    fetch();
  }, []);

  const handlePdfChange = async (file: File | null) => {
    setPdfFile(file);
    setAutoCoverUrl(null);
    if (!file) return;

    setExtractingThumbnail(true);
    try {
      // Auto-extract page 1 as high-res thumbnail & calculate page count
      const { dataUrl, blob, numPages } = await generatePdfThumbnail(file, 1, 800);
      setAutoCoverUrl(dataUrl);
      setPageCount(numPages);

      // Create cover file from blob if user hasn't selected a manual cover
      if (!coverFile) {
        const generatedCoverFile = new File(
          [blob],
          `${file.name.replace(/\.[^/.]+$/, '')}-page-1.jpg`,
          { type: 'image/jpeg' }
        );
        setCoverFile(generatedCoverFile);
      }
    } catch (err) {
      console.warn('Auto PDF thumbnail extraction error:', err);
    }
    setExtractingThumbnail(false);
  };

  const onCreate = async () => {
    if (!pdfFile) return alert('कृपया ई-पेपर की PDF फाइल चुनें');
    setUploading(true);
    try {
      const up = await epapersService.uploadPdf(pdfFile, coverFile || undefined);
      await epapersService.create({
        title,
        edition_date: editionDate,
        edition_type: 'daily',
        city_edition: cityEdition,
        page_count: Number(pageCount),
        pdf_storage_path: up.pdfPath,
        pdf_public_url: up.pdfUrl,
        cover_image_path: up.coverPath,
        cover_public_url: up.coverUrl || autoCoverUrl || undefined,
        page_images: up.coverUrl ? [up.coverUrl] : autoCoverUrl ? [autoCoverUrl] : [],
        file_size: up.fileSize,
        status: 'published',
        is_featured: isFeatured,
        language: 'hi',
        published_at: new Date().toISOString()
      } as any);

      setPdfFile(null);
      setCoverFile(null);
      setAutoCoverUrl(null);
      alert('ई-पेपर और पेज 1 प्रीव्यू सफलतापूर्वक प्रकाशित हो गया है ✓');
      fetch();
    } catch (e: any) {
      alert(e.message);
    }
    setUploading(false);
  };

  const toggleFeatured = async (id: string, cur: boolean) => {
    await epapersService.update(id, { is_featured: !cur } as any);
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm('क्या आप वाकई इस ई-पेपर को हटाना चाहते हैं?')) return;
    await epapersService.remove(id);
    fetch();
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-sm">
        <h3 className="font-black text-base text-black mb-3 pb-2 border-b border-neutral-200 flex items-center gap-2 font-devanagari">
          <Newspaper className="w-5 h-5 text-black" /> नया ई-पेपर संस्करण अपलोड एवं प्रकाशित करें
        </h3>

        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-black mb-1 font-devanagari">संस्करण का नाम / शीर्षक *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="उदा. चित्रकूट ज्योति - भोपाल मुख्य संस्करण"
              className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-medium text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 font-devanagari">शहर / क्षेत्रीय संस्करण (City)</label>
            <select
              value={cityEdition}
              onChange={e => setCityEdition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-medium text-xs focus:outline-none font-devanagari"
            >
              <option value="चित्रकूट (मुख्य)">चित्रकूट (मुख्य)</option>
              <option value="भोपाल">भोपाल</option>
              <option value="सतना">सतना</option>
              <option value="रीवा">रीवा</option>
              <option value="ग्वालियर">ग्वालियर</option>
              <option value="इंदौर">इंदौर</option>
              <option value="जबलपुर">जबलपुर</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 font-devanagari">अखबार की तारीख (Date) *</label>
            <input
              type="date"
              value={editionDate}
              onChange={e => setEditionDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-medium text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 font-devanagari">कुल पेज संख्या (Page Count)</label>
            <input
              type="number"
              min={1}
              max={64}
              value={pageCount}
              onChange={e => setPageCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-medium text-xs focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer font-devanagari">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer"
            />
            <span>होमपेज पर मुख्य ई-पेपर बनाएं (Featured Edition)</span>
          </label>
        </div>

        {/* Upload boxes with Live Page 1 Preview */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-3.5 bg-neutral-50 rounded-xl border-2 border-dashed border-black flex flex-col justify-between">
            <div>
              <label className="block text-xs font-black text-black mb-1 font-devanagari">
                ई-पेपर PDF फाइल चुनें * (अनिवार्य)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handlePdfChange(e.target.files?.[0] || null)}
                className="w-full text-xs text-black border border-neutral-300 rounded-lg p-2 bg-white cursor-pointer"
              />
            </div>

            {extractingThumbnail && (
              <div className="mt-2 text-xs font-bold text-neutral-600 flex items-center gap-1.5 font-devanagari">
                <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                <span>PDF से पहले पेज का प्रीव्यू तैयार किया जा रहा है...</span>
              </div>
            )}

            {pdfFile && !extractingThumbnail && (
              <p className="text-[11px] font-bold text-black mt-2 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Page 1 Extracted Preview Display */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300 flex items-center gap-4">
            <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-neutral-300 bg-white flex items-center justify-center shadow-xs">
              {extractingThumbnail ? (
                <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
              ) : autoCoverUrl ? (
                <img src={autoCoverUrl} alt="Page 1 Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-neutral-300" />
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-black font-devanagari block">
                पेज 1 ऑटो-प्रीव्यू (First Page Cover)
              </span>
              <p className="text-[11px] text-neutral-600 font-devanagari">
                {autoCoverUrl
                  ? '✓ PDF से पहले पेज की फोटो अपने आप बन गई है। अलग से फोटो डालने की जरूरत नहीं है।'
                  : 'PDF फाइल चुनते ही पहले पेज का प्रीव्यू यहाँ अपने आप तैयार हो जाएगा।'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={onCreate}
            disabled={uploading || !pdfFile || extractingThumbnail}
            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black disabled:opacity-40 flex items-center gap-1.5 shadow transition-colors font-devanagari"
          >
            <Upload className="w-4 h-4" /> {uploading ? 'अपलोड एवं प्रकाशित हो रहा है...' : 'ई-पेपर अपलोड एवं प्रकाशित करें'}
          </button>
          <span className="text-[11px] text-neutral-600 font-medium">
            प्रकाशन के तुरंत बाद पाठक <span className="font-mono text-black font-bold">/epaper</span> पर पढ़ सकेंगे।
          </span>
        </div>
      </div>

      {/* Published E-Papers Table */}
      {loading ? (
        <div className="h-32 bg-white rounded-2xl border-2 border-black animate-pulse" />
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-black p-12 text-center shadow-sm">
          <Newspaper className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <p className="font-black text-black font-devanagari text-base">अभी कोई ई-पेपर प्रकाशित नहीं है</p>
          <p className="text-xs text-neutral-600 font-devanagari mt-1">ऊपर दिए गए फॉर्म से आज का ई-पेपर पीडीएफ अपलोड करें।</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
          <div className="p-3.5 bg-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-between font-devanagari">
            <span>प्रकाशित ई-पेपर सूची ({list.length})</span>
            <span className="text-[11px] text-neutral-300 font-normal">Chitrakoot Jyoti Editions</span>
          </div>

          <table className="w-full text-xs">
            <thead className="bg-neutral-100 text-[11px] uppercase font-black text-black border-b-2 border-black">
              <tr>
                <th className="p-3 text-left font-devanagari">पेज 1 प्रीव्यू</th>
                <th className="p-3 text-left font-devanagari">संस्करण एवं विवरण</th>
                <th className="p-3 text-center font-devanagari">तारीख</th>
                <th className="p-3 text-center font-devanagari">स्थिति</th>
                <th className="p-3 text-center font-devanagari">मुख्य (Featured)</th>
                <th className="p-3 text-center font-devanagari">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {list.map(e => (
                <tr key={e.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3">
                    <div className="w-12 h-16 rounded border-2 border-black shadow-xs overflow-hidden bg-white">
                      <EpaperThumbnail
                        coverUrl={e.cover_public_url}
                        pdfUrl={e.pdf_public_url}
                        title={e.title}
                        editionDate={e.edition_date}
                        cityEdition={e.city_edition}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-black line-clamp-1 font-devanagari">{e.title}</span>
                      {e.city_edition && (
                        <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-[10px] font-bold text-neutral-800 font-devanagari shrink-0">
                          {e.city_edition}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-600 font-mono mt-0.5">
                      <span>कुल {e.page_count || 8} पेज</span>
                      <span>• {e.pdf_storage_path?.slice(0, 30)}...</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-black font-mono">{e.edition_date}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black border border-black bg-black text-white uppercase">
                      {e.status === 'published' ? 'प्रकाशित' : e.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleFeatured(e.id, e.is_featured)}
                      className={`p-1.5 rounded-lg border border-black ${e.is_featured ? 'bg-black text-amber-400' : 'bg-white text-neutral-400'}`}
                      title="मुख्य संस्करण बदलें"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5 justify-center">
                      <Link
                        to={`/epaper/read/${e.id}`}
                        target="_blank"
                        className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg border border-neutral-300 text-black transition-colors"
                        title="वेबसाइट में ई-पेपर पढ़ें"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {e.pdf_public_url && (
                        <a
                          href={e.pdf_public_url}
                          download
                          className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg border border-neutral-300 text-black transition-colors"
                          title="सीधे PDF डाउनलोड करें"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => remove(e.id)}
                        className="p-1.5 bg-white hover:bg-red-600 hover:text-white rounded-lg border border-red-300 text-red-600 transition-colors"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

