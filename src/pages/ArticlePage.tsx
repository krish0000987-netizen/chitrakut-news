import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { AdvertisementSlot } from '../components/common/AdvertisementSlot';
import { StoryCard } from '../components/news/StoryCard';
import { SocialShareButtons } from '../components/common/SocialShareButtons';
import { 
  Bookmark, Share2, Printer, Clock, Eye, MessageSquare, 
  ChevronRight, Twitter, Mail, MapPin, ThumbsUp, Send, CheckCircle2, User, Sparkles, AlertCircle, ArrowLeft
} from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { 
    articles, 
    toggleSaveArticle, 
    isArticleSaved, 
    fontSize, 
    setFontSize 
  } = useNews();

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; name: string; text: string; time: string }>>([
    { id: 'c1', name: 'Alok Nath', text: 'Crucial policy move for Indian digital infrastructure. Hope execution across tier-2 cities is prioritized.', time: '2 hours ago' },
    { id: 'c2', name: 'Dr. Sunita Sharma', text: 'The focus on domestic semiconductor hubs will transform hardware innovation across the subcontinent.', time: '1 hour ago' }
  ]);
  const [likesCount, setLikesCount] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);

  const article = articles.find(a => a.id === articleId) || articles[0];

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif-title text-2xl font-bold">Article Not Found</h2>
        <p className="text-slate-500 mt-2">The news piece you are searching for might have been moved or archived.</p>
        <Link to="/" className="inline-block mt-4 bg-red-900 text-white font-bold px-4 py-2 rounded text-xs uppercase">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const saved = isArticleSaved(article.id);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newC = {
      id: `c-${Date.now()}`,
      name: 'Verified Reader',
      text: commentText,
      time: 'Just now'
    };
    setComments([newC, ...comments]);
    setCommentText('');
  };

  const handlePrint = () => {
    window.print();
  };

  const relatedArticles = articles
    .filter(a => a.id !== article.id && (a.category === article.category || a.state === article.state))
    .slice(0, 3);

  const fontClass = 
    fontSize === 'sm' ? 'text-sm leading-relaxed' :
    fontSize === 'lg' ? 'text-lg leading-relaxed' :
    fontSize === 'xl' ? 'text-xl leading-relaxed' :
    'text-base leading-relaxed';

  return (
    <article className="max-w-7xl mx-auto px-4 py-6">
      
      {/* 1. TOP BREADCRUMB & METADATA BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-6 border-b border-slate-200 dark:border-slate-800 text-xs font-sans-ui no-print">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <button onClick={() => navigate(-1)} className="hover:text-red-800 flex items-center space-x-1 font-bold mr-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to={`/category/${article.category.toLowerCase()}`} className="font-bold text-red-800 dark:text-red-400 uppercase">
            {article.category}
          </Link>
          {article.state && (
            <>
              <span>/</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{article.state}</span>
            </>
          )}
        </div>

        {/* Demo Tag Disclaimer */}
        {article.isDemo && (
          <div className="flex items-center space-x-1 text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded font-mono text-[10px] border border-amber-300 dark:border-amber-800">
            <AlertCircle className="w-3 h-3" />
            <span>DEMONSTRATION NEWS EDITION CONTENT</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN ARTICLE BODY (8 cols) */}
        <div className="lg:col-span-8">
          
          {/* Headline */}
          <h1 className="font-serif-title font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-slate-100 leading-[1.12]">
            {article.title}
          </h1>

          {/* Hindi Title Translation if Available */}
          {article.hindiTitle && (
            <p className="font-devanagari text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300 mt-2">
              {article.hindiTitle}
            </p>
          )}

          {/* Subheadline */}
          <p className="font-serif-body text-base sm:text-lg text-slate-700 dark:text-slate-300 mt-4 leading-relaxed italic border-l-4 border-red-900 pl-4 py-1">
            {article.subheadline}
          </p>

          {/* Author & Timestamp Row */}
          <div className="my-6 p-4 bg-slate-100/80 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-red-900"
              />
              <div>
                <Link to={`/author/${article.author.id}`} className="font-sans-ui font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-red-800">
                  {article.author.name}
                </Link>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans-ui">{article.author.role} • {article.author.location || 'New Delhi'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Published: {new Date(article.publishedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-sans-ui text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-red-800" />
                <span>{article.readTimeMinutes} min read</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.viewsCount.toLocaleString()} reads</span>
              </span>
            </div>
          </div>

          {/* PROMINENT SOCIAL SHARE BAR AT THE STARTING OF ARTICLE */}
          <div className="my-4 p-3.5 sm:p-4 bg-gradient-to-r from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border-2 border-red-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print font-devanagari">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000] animate-pulse"></span>
              <span className="font-black text-xs sm:text-sm text-[#8B0000] dark:text-red-400">
                सोशल मीडिया पर शेयर करें:
              </span>
            </div>
            <SocialShareButtons
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={article.hindiTitle || article.title}
              summary={article.subheadline}
              variant="badges"
              showLabel={false}
            />
          </div>

          {/* Sticky Toolbar (Save, Font Size, Print, Quick Share) */}
          <div className="sticky top-14 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 my-4 flex flex-wrap items-center justify-between gap-2.5 shadow-sm no-print">
            
            {/* Quick Share Icons in Toolbar */}
            <div className="flex items-center space-x-2">
              <SocialShareButtons
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={article.hindiTitle || article.title}
                summary={article.subheadline}
                variant="compact"
                showLabel={false}
              />
            </div>

            {/* Font Sizer Controls & Action Buttons */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-xs font-sans-ui font-semibold text-slate-600 dark:text-slate-400">
                <span className="mr-1 hidden sm:inline">Text Size:</span>
                {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${
                      fontSize === s ? 'bg-red-900 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-1.5 border-l pl-3 border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => toggleSaveArticle(article.id)}
                  className={`p-2 rounded-full border transition-colors ${
                    saved ? 'bg-red-800 text-white border-red-800' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                  title={saved ? "Saved in bookmarks" : "Save article"}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  title="Print Article"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image & Caption */}
          <figure className="my-6">
            <div className="rounded-xl overflow-hidden bg-slate-950 aspect-[16/9] shadow-md">
              <img
                src={article.heroImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-sans-ui italic">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>

          {/* Key Points Info Box if Available */}
          {article.infoBox && (
            <div className="my-6 p-5 bg-red-50/80 dark:bg-red-950/40 border-l-4 border-red-800 rounded-r-lg font-sans-ui">
              <h3 className="font-bold text-sm text-red-900 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{article.infoBox.title}</span>
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {article.infoBox.points.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-red-800 dark:text-red-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Body Paragraphs */}
          <div className={`article-body font-serif-body text-slate-900 dark:text-slate-100 space-y-6 ${fontClass}`}>
            {article.content.map((paragraph, index) => {
              // Insert Pull Quote after 2nd paragraph if available
              const showPullQuote = index === 2 && article.pullQuotes && article.pullQuotes[0];

              return (
                <React.Fragment key={index}>
                  <p className="leading-relaxed">{paragraph}</p>
                  
                  {showPullQuote && (
                    <blockquote className="my-8 p-6 bg-slate-100 dark:bg-slate-900 rounded-xl border-l-4 border-amber-500 font-serif-title font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-200 italic shadow-sm">
                      "{article.pullQuotes![0]}"
                    </blockquote>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Tags Chips */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold font-sans-ui text-slate-500 uppercase mr-2">TOPICS:</span>
            {article.tags.map(tag => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-red-800 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Article Reaction & Like Button */}
          <div className="my-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  hasLiked
                    ? 'bg-red-800 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{hasLiked ? 'Recommended' : 'Recommend This Article'}</span>
                <span className="bg-red-950 text-white px-1.5 py-0.5 rounded text-[10px] ml-1">{likesCount}</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-sans-ui">
              <span>{comments.length} Reader Comments</span>
            </div>
          </div>

          {/* Social Share Banner with Logos (Facebook, X, WhatsApp, Instagram) */}
          <div className="my-6 p-4 sm:p-5 bg-gradient-to-r from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border-2 border-red-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-devanagari">
            <div>
              <p className="font-black text-sm text-[#8B0000] dark:text-red-400 flex items-center gap-1.5">
                <Share2 className="w-4 h-4" /> यह खबर सोशल मीडिया पर शेयर करें:
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                सत्य और सटीक समाचार अपने मित्रों एवं ग्रुप में साझा करें
              </p>
            </div>
            <SocialShareButtons
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={article.hindiTitle || article.title}
              summary={article.subheadline}
              variant="badges"
              showLabel={false}
            />
          </div>

          {/* Author Bio Box */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 my-8">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-red-900 shrink-0"
            />
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-serif-title font-bold text-base text-slate-900 dark:text-slate-100">
                  Written by {article.author.name}
                </h4>
                {article.author.twitter && (
                  <a href={`https://twitter.com/${article.author.twitter}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center space-x-1">
                    <Twitter className="w-3.5 h-3.5" />
                    <span>{article.author.twitter}</span>
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-serif-body">
                {article.author.bio}
              </p>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <section className="my-10 pt-8 border-t-2 border-red-900">
            <h3 className="font-serif-title font-black text-xl text-slate-900 dark:text-slate-100 uppercase mb-6 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-red-800" />
              <span>READER DISCUSSION ({comments.length})</span>
            </h3>

            {/* Comment Submission Form */}
            <form onSubmit={handleAddComment} className="mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your opinion on this story (Civic and respectful discussion)..."
                className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded-lg text-xs font-sans-ui border border-slate-200 dark:border-slate-800 outline-none focus:border-red-800 min-h-[90px]"
                required
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-[10px] text-slate-400">Moderated by editorial standard guidelines</p>
                <button
                  type="submit"
                  className="bg-red-800 hover:bg-red-900 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.name}</span>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-serif-body">{c.text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* SIDEBAR RIGHT (4 cols) */}
        <aside className="lg:col-span-4 space-y-8 no-print">
          
          {/* Ad Slot */}
          <AdvertisementSlot type="sidebar" />

          {/* Related Articles Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-serif-title font-bold text-sm uppercase text-red-800 dark:text-red-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
              RELATED HEADLINES
            </h3>
            <div className="space-y-3">
              {relatedArticles.map(art => (
                <StoryCard key={art.id} article={art} variant="compact" />
              ))}
            </div>
          </div>

          {/* E-Paper Promo Card */}
          <div className="bg-gradient-to-br from-red-900 to-black text-white p-5 rounded-xl border border-red-800 shadow-md">
            <span className="bg-amber-400 text-black font-bold text-[10px] px-2 py-0.5 rounded uppercase font-sans-ui">
              PRINT EDITION
            </span>
            <h4 className="font-serif-title font-bold text-lg mt-2">
              Read Today’s Printed Newspaper
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Access the exact replica of New Delhi & Mumbai print editions on your phone or tablet.
            </p>
            <Link
              to="/epaper"
              className="mt-4 bg-white text-red-900 font-bold text-xs py-2 px-4 rounded inline-block uppercase tracking-wider hover:bg-slate-100 transition-colors"
            >
              Open E-Paper Reader
            </Link>
          </div>

        </aside>

      </div>
    </article>
  );
};
