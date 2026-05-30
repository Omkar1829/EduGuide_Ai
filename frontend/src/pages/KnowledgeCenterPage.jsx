import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Sparkles, Newspaper, BookOpen, Clock, Tag, Globe, 
  ArrowRight, Heart, Share2, Compass, Bookmark 
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import PricingModal from '../components/common/PricingModal';
import Spinner from '../components/common/Spinner';

const KnowledgeCenterPage = () => {
  const { user } = useSelector((state) => state.auth || {});

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const isProOrAbove = user?.subscriptionTier === 'PRO' || user?.subscriptionTier === 'PRO_PLUS';

  useEffect(() => {
    if (isProOrAbove) {
      fetchArticles();
    }
  }, [isProOrAbove]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ai/knowledge-center/articles');
      if (response.success) {
        setArticles(response.data);
      } else {
        toast.error('Failed to retrieve news.');
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching customized news articles.');
    } finally {
      setLoading(false);
    }
  };

  // Gated Screen for NEWBIE users
  if (!isProOrAbove) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-12 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 glass border border-indigo-500/20 rounded-3xl p-8 max-w-lg shadow-glass bg-gray-900/60 backdrop-blur-2xl animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
            <Newspaper className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI Knowledge Hub
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
            AI Knowledge Center
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            Get ahead of the curve! Stay updated with customized tech trend reports, industry articles, and career newsletters dynamically curated by AI specifically matching your academic majors and personal interest metrics.
          </p>

          <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 space-y-2 text-left text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time news feeds tailored to your domain of study</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stay updated with key daily market shifting trends</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI summaries and analysis for fast scanning</span>
            </div>
          </div>

          <button
            onClick={() => setShowPricingModal(true)}
            className="w-full py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Upgrade to Pro
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <PricingModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Knowledge</span> Center
          </h1>
          <p className="text-gray-400">Personalized tech and industry news curated uniquely for your profile.</p>
        </div>
        <button
          onClick={fetchArticles}
          disabled={loading}
          className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : <Sparkles className="w-4 h-4 text-indigo-400" />}
          Refresh News Feed
        </button>
      </div>

      {loading && articles.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4 text-indigo-500" />
            <p className="text-gray-400 animate-pulse">Gemini is writing custom briefings...</p>
          </div>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <div 
              key={art.id || idx}
              className="flex flex-col h-full rounded-2xl glass border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/5 bg-slate-900/40 relative group"
            >
              {/* Image banner mock */}
              <div className="h-44 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center relative p-6">
                <Newspaper className="w-12 h-12 text-indigo-500/40 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  {art.category || 'General'}
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[10px] text-gray-400 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  3 min read
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 space-y-4 justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {art.summary}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-4 pt-2 border-t border-white/5">
                    {art.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    <Tag className="w-3.5 h-3.5" />
                    {art.industry || 'Tech'}
                  </span>
                  <div className="flex gap-2 text-gray-500">
                    <button className="p-1 rounded hover:bg-white/5 hover:text-white transition">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-1 rounded hover:bg-white/5 hover:text-white transition">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass border border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-white text-lg font-bold mb-2">No Articles Curated</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            Refresh your news feed to ask Gemini to customize a brand new personalized daily industry brief for you!
          </p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCenterPage;
