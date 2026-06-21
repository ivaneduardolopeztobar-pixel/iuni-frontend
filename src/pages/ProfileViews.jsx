import { useState, useEffect } from "react";
import { Building2, MapPin, Clock, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import ErrorMsg from "../components/ErrorMsg";
import api from "../api/client";

export default function ProfileViews() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setLoading(true);
    api.get("/views/my").then(r => setViews(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

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
      <SEO title="Quien vio mi perfil" description="Empresas que han visitado tu perfil en iUNI" />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-7 animate-fade-in">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
            <Eye size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Quien vio mi perfil</h1>
            <p className="text-gray-500 text-sm mt-0.5">Empresas que han visitado tu perfil</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorMsg onRetry={load} />
        ) : views.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-fade-in">
            <Building2 size={40} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500">Nadie ha visto tu perfil aun</p>
            <p className="text-gray-600 text-xs mt-2">Cuando un empleador vea tu perfil aparecera aqui</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {views.map((view, i) => (
              <div
                key={view.id}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all animate-slide-up"
                style={{ animationDelay: i * 40 + "ms" }}
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 text-red-500">
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
                    Visualizacion por postulacion a una oferta
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
