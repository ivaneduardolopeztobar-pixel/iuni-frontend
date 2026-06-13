import { useState, useEffect } from "react";
import { Building2, MapPin, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

export default function ProfileViews() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get("/views/my").then(r => setViews(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (days > 0) return "hace " + days + " dia" + (days !== 1 ? "s" : "");
    if (hours > 0) return "hace " + hours + " hora" + (hours !== 1 ? "s" : "");
    return "hace " + minutes + " minuto" + (minutes !== 1 ? "s" : "");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-2">Quien vio mi perfil</h1>
        <p className="text-gray-500 text-sm mb-6">Empresas que han visitado tu perfil</p>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-950 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorMsg onRetry={() => { setError(false); setLoading(true); api.get("/views/my").then(r => setViews(r.data)).catch(() => setError(true)).finally(() => setLoading(false)); }} />
        ) : views.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p>Nadie ha visto tu perfil aun</p>
            <p className="text-xs mt-2">Cuando un empleador vea tu perfil aparecera aqui</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {views.map(view => (
              <div key={view.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0 text-red-500">
                  {view.employer && view.employer.companyName && view.employer.companyName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">
                    {view.employer && view.employer.companyName}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                    {view.employer && view.employer.sector && (
                      <span className="flex items-center gap-1">
                        <Building2 size={11} />
                        {view.employer.sector}
                      </span>
                    )}
                    {view.employer && view.employer.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {view.employer.city}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Visualizacion por inscripcion a una oferta
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs shrink-0">
                  <Clock size={12} />
                  {timeAgo(view.viewedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
