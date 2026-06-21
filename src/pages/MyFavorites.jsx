import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import ErrorMsg from '../components/ErrorMsg';
import ApplyModal from '../components/ApplyModal';
import api from '../api/client';

export default function MyFavorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [applyModal, setApplyModal] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    setError(false);
    setLoading(true);
    api.get('/favorites/my').then(r => setFavs(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (e, jobId) => {
    e.stopPropagation();
    await api.post(`/favorites/${jobId}/toggle`);
    setFavs(prev => prev.filter(f => f.jobPostId !== jobId));
  };

  const shareJob = (e, fav) => {
    e.stopPropagation();
    const url = window.location.origin + "/jobs/" + fav.jobPostId;
    const text = "Mira esta oferta en iUNI: " + fav.jobPost?.title + ". Aplica aqui: " + url;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Mis favoritos" description="Tus empleos guardados en iUNI" />
      <Navbar />

      {applyModal && (
        <ApplyModal
          jobId={applyModal.jobPostId}
          jobTitle={applyModal.jobPost?.title}
          onClose={() => setApplyModal(null)}
          onSuccess={() => { setApplyModal(null); alert("Postulacion enviada exitosamente!"); }}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-7 animate-fade-in">
          <h1 className="text-2xl font-black">Mis favoritos</h1>
          {!loading && !error && favs.length > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              {favs.length} empleo{favs.length !== 1 ? "s" : ""} guardado{favs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl h-20 animate-pulse" />)}
          </div>
        ) : error ? (
          <ErrorMsg onRetry={load} />
        ) : favs.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-fade-in">
            <Heart size={40} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500">No tienes empleos guardados</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favs.map((fav, i) => (
              <div
                key={fav.id}
                onClick={() => navigate(`/jobs/${fav.jobPostId}`)}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-red-600/40 hover:bg-white/[0.05] cursor-pointer transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up"
                style={{ animationDelay: i * 40 + "ms" }}
              >
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{fav.jobPost?.title}</h3>
                  <p className="text-red-500 text-sm font-medium">{fav.jobPost?.employer?.companyName}</p>
                  {fav.jobPost?.employer?.city && (
                    <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                      <MapPin size={11} />{fav.jobPost.employer.city}
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={e => shareJob(e, fav)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
                    <Share2 size={16} className="text-gray-500 hover:text-green-500 transition-colors" />
                  </button>
                  <button onClick={e => remove(e, fav.jobPostId)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setApplyModal(fav); }}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-600/20"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
