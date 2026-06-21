import { useState, useEffect } from "react";
import { TrendingUp, Briefcase, Heart, Users, Eye, CheckCircle, XCircle, Clock, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

const STATUS_LABELS = {
  POSTULADO: { label: "Postulado", color: "bg-blue-950 text-blue-400 border-blue-900" },
  EN_REVISION: { label: "En revision", color: "bg-yellow-950 text-yellow-400 border-yellow-900" },
  ACEPTADO: { label: "Aceptado", color: "bg-green-950 text-green-400 border-green-900" },
  RECHAZADO: { label: "Rechazado", color: "bg-red-950 text-red-400 border-red-900" },
};

export default function EmployerMetrics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/metrics/employer")
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando metricas...</p>
    </div>
  );

  if (!data) return null;

  const maxApps = Math.max(...data.last7days.map(d => d.applications), 1);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Metricas</h1>
            <p className="text-gray-500 text-sm">Rendimiento de tus publicaciones</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <SummaryCard icon={<Briefcase size={20}/>} label="Empleos activos" value={data.summary.activeJobs + "/" + data.summary.totalJobs} color="blue" />
          <SummaryCard icon={<Users size={20}/>} label="Postulaciones" value={data.summary.totalApplications} color="red" />
          <SummaryCard icon={<Heart size={20}/>} label="Favoritos" value={data.summary.totalFavorites} color="pink" />
          <SummaryCard icon={<Eye size={20}/>} label="Vistas de perfil" value={data.summary.profileViews} color="purple" />
          <SummaryCard icon={<Star size={20}/>} label="Empleos totales" value={data.summary.totalJobs} color="yellow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Grafica de ultimos 7 dias */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" /> Postulaciones ultimos 7 dias
            </h3>
            <div className="flex items-end gap-2 h-32">
              {data.last7days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-600">{d.applications > 0 ? d.applications : ""}</span>
                  <div
                    className="w-full bg-red-600 rounded-t-lg transition-all"
                    style={{ height: maxApps > 0 ? (d.applications / maxApps * 100) + "%" : "4px", minHeight: "4px" }}
                  />
                  <span className="text-xs text-gray-600 text-center leading-tight">{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Postulaciones por estado */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-red-500" /> Estado de postulaciones
            </h3>
            {data.applicationsByStatus.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-8">Sin postulaciones aun</p>
            ) : (
              <div className="space-y-3">
                {data.applicationsByStatus.map(s => {
                  const cfg = STATUS_LABELS[s.status] || { label: s.status, color: "bg-white/[0.04] text-gray-400 border-white/10" };
                  const pct = data.summary.totalApplications > 0
                    ? Math.round(s._count.status / data.summary.totalApplications * 100)
                    : 0;
                  return (
                    <div key={s.status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={"text-xs font-bold px-2 py-0.5 rounded-full border " + cfg.color}>{cfg.label}</span>
                        <span className="text-sm font-bold">{s._count.status} <span className="text-gray-600 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                        <div className="bg-red-600 h-1.5 rounded-full transition-all" style={{ width: pct + "%" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top empleos */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Star size={16} className="text-red-500" /> Tus mejores ofertas
          </h3>
          {data.topJobs.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">Sin publicaciones aun</p>
          ) : (
            <div className="space-y-3">
              {data.topJobs.map((job, i) => (
                <div key={job.id} className="flex items-center gap-4 p-4 bg-white/[0.04] rounded-xl border border-white/10">
                  <span className="text-2xl font-black text-gray-700 w-8 text-center">#{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(job.createdAt).toLocaleDateString("es-SV")}
                    </p>
                  </div>
                  <div className="flex gap-4 text-center shrink-0">
                    <div>
                      <p className="text-lg font-black text-red-500">{job.applications}</p>
                      <p className="text-xs text-gray-600">Apps</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-pink-500">{job.favorites}</p>
                      <p className="text-xs text-gray-600">Favs</p>
                    </div>
                    <div>
                      <span className={"text-xs font-bold px-2 py-0.5 rounded-full " + (job.isActive ? "bg-green-950 text-green-400" : "bg-gray-800 text-gray-500")}>
                        {job.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }) {
  const colors = {
    blue: "text-blue-400", red: "text-red-400", pink: "text-pink-400",
    purple: "text-purple-400", yellow: "text-yellow-400"
  };
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
      <div className={"flex justify-center mb-2 " + colors[color]}>{icon}</div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
    </div>
  );
}
