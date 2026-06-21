import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import ErrorMsg from '../components/ErrorMsg';
import api from '../api/client';

const STATUS = {
  POSTULADO: { label: 'Postulado', cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  EN_REVISION: { label: 'En revisión', cls: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
  ACEPTADO: { label: 'Aceptado', cls: 'bg-green-500/10 text-green-300 border-green-500/20' },
  RECHAZADO: { label: 'Rechazado', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setError(false);
    setLoading(true);
    api.get('/applications/my').then(r => setApps(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Mis postulaciones" description="Revisa el estado de tus postulaciones en iUNI" />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-7 animate-fade-in">
          <h1 className="text-2xl font-black">Mis postulaciones</h1>
          {!loading && !error && apps.length > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              {apps.length} postulacion{apps.length !== 1 ? "es" : ""} en total
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl h-20 animate-pulse" />)}
          </div>
        ) : error ? (
          <ErrorMsg onRetry={load} />
        ) : apps.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-fade-in">
            <Briefcase size={40} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500">No has aplicado a ningun empleo aun</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {apps.map((app, i) => {
              const s = STATUS[app.status] || STATUS.POSTULADO;
              const days = Math.floor((Date.now() - new Date(app.createdAt)) / 86400000);
              return (
                <div
                  key={app.id}
                  onClick={() => navigate(`/jobs/${app.jobPostId}`)}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-red-600/40 hover:bg-white/[0.05] cursor-pointer transition-all flex items-center justify-between gap-4 animate-slide-up"
                  style={{ animationDelay: i * 40 + "ms" }}
                >
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{app.jobPost?.title}</h3>
                    <p className="text-red-500 text-sm font-medium">{app.jobPost?.employer?.companyName}</p>
                    <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                      <Clock size={11} /> hace {days} día{days !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
