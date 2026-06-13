import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/client';

const STATUS = {
  POSTULADO: { label: 'Postulado', cls: 'bg-blue-950 text-blue-300 border-blue-900' },
  EN_REVISION: { label: 'En revisión', cls: 'bg-yellow-950 text-yellow-300 border-yellow-900' },
  ACEPTADO: { label: 'Aceptado', cls: 'bg-green-950 text-green-300 border-green-900' },
  RECHAZADO: { label: 'Rechazado', cls: 'bg-red-950 text-red-400 border-red-900' },
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/applications/my').then(r => setApps(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-6">Mis Postulaciones</h1>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="bg-gray-950 rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : error ? (
          <ErrorMsg onRetry={() => { setError(false); setLoading(true); api.get("/applications/my").then(r => setApps(r.data)).catch(() => setError(true)).finally(() => setLoading(false)); }} />
        ) : apps.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p>No has aplicado a ningún empleo aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {apps.map(app => {
              const s = STATUS[app.status] || STATUS.POSTULADO;
              const days = Math.floor((Date.now() - new Date(app.createdAt)) / 86400000);
              return (
                <div
                  key={app.id}
                  onClick={() => navigate(`/jobs/${app.jobPostId}`)}
                  className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-red-600 cursor-pointer transition flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold">{app.jobPost?.title}</h3>
                    <p className="text-red-500 text-sm">{app.jobPost?.employer?.companyName}</p>
                    <p className="text-gray-600 text-xs mt-1">hace {days} día{days !== 1 ? 's' : ''}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${s.cls}`}>
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
