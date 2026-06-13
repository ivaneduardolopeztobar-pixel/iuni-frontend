import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/client';

export default function MyFavorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/favorites/my').then(r => setFavs(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  const remove = async (e, jobId) => {
    e.stopPropagation();
    await api.post(`/favorites/${jobId}/toggle`);
    setFavs(prev => prev.filter(f => f.jobPostId !== jobId));
  };

  const apply = async (e, jobId) => {
    e.stopPropagation();
    try {
      await api.post(`/applications/${jobId}/apply`);
      alert('¡Postulación enviada!');
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-6">Mis Favoritos</h1>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="bg-gray-950 rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : error ? (
          <ErrorMsg onRetry={() => { setError(false); setLoading(true); api.get("/favorites/my").then(r => setFavs(r.data)).catch(() => setError(true)).finally(() => setLoading(false)); }} />
        ) : favs.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p>No tienes empleos guardados</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favs.map(fav => (
              <div
                key={fav.id}
                onClick={() => navigate(`/jobs/${fav.jobPostId}`)}
                className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-red-600 cursor-pointer transition flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold">{fav.jobPost?.title}</h3>
                  <p className="text-red-500 text-sm">{fav.jobPost?.employer?.companyName}</p>
                  {fav.jobPost?.employer?.city && (
                    <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                      <MapPin size={11}/>{fav.jobPost.employer.city}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={e => remove(e, fav.jobPostId)} className="p-2 hover:bg-gray-800 rounded-lg transition">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>
                  <button
                    onClick={e => apply(e, fav.jobPostId)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
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
