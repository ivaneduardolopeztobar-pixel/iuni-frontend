import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Users, Clock, Briefcase, ShieldCheck, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import api from "../api/client";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function EmployerPublicProfile() {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/employer/public/" + employerId)
      .then(r => setEmployer(r.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [employerId]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  );

  if (!employer) return null;

  const logoUrl = employer.photoPath || null;
  const memberSince = new Date(employer.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title={employer.companyName}
        description={"Conoce a " + employer.companyName + " en iUNI. " + (employer.sector || "") + (employer.city ? " — " + employer.city : "") + ". Ve sus ofertas de empleo para estudiantes universitarios."}
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition text-sm">
          <ArrowLeft size={16} /> Volver
        </button>

        {/* Header empresa */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden mb-6 animate-fade-in">
          <div className="h-24 bg-gradient-to-r from-white/[0.04] to-transparent border-b border-white/10" />
          <div className="px-8 pb-8">
            <div className="flex items-end gap-5 -mt-10 mb-6">
              <div className="w-20 h-20 rounded-xl border-4 border-black overflow-hidden bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-black text-2xl">
                    {employer.companyName && employer.companyName[0]}
                  </span>
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black">{employer.companyName}</h1>
                  {employer.verified && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-950 border border-green-900 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={11} /> Verificada
                    </span>
                  )}
                </div>
                {employer.sector && <p className="text-red-500 text-sm font-medium">{employer.sector}</p>}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {employer.city && (
                <InfoCard icon={<MapPin size={16} className="text-red-500" />} label="Ubicacion" value={employer.city + (employer.country ? ", " + employer.country : "")} />
              )}
              {employer.workerCount && (
                <InfoCard icon={<Users size={16} className="text-red-500" />} label="Empleados" value={employer.workerCount + " personas"} />
              )}
              {employer.companySchedule && (
                <InfoCard icon={<Clock size={16} className="text-red-500" />} label="Horario" value={employer.companySchedule} />
              )}
              <InfoCard icon={<Calendar size={16} className="text-red-500" />} label="Miembro desde" value={memberSince} />
            </div>
          </div>
        </div>

        {/* Estadisticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center hover:border-white/20 transition-all">
            <p className="text-3xl font-black text-red-500">{employer._count?.jobPosts || 0}</p>
            <p className="text-gray-500 text-sm mt-1">Empleos publicados</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center hover:border-white/20 transition-all">
            <p className="text-3xl font-black text-red-500">
              {employer.jobPosts?.reduce((sum, j) => sum + (j._count?.applications || 0), 0) || 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">Postulaciones recibidas</p>
          </div>
        </div>

        {/* Ofertas activas */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 animate-slide-up">
          <h2 className="font-black text-lg mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-red-500" />
            Ofertas activas ({employer.jobPosts?.length || 0})
          </h2>

          {employer.jobPosts?.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No hay ofertas activas en este momento</p>
          ) : (
            <div className="flex flex-col gap-3">
              {employer.jobPosts?.map(job => (
                <div
                  key={job.id}
                  onClick={() => navigate("/jobs/" + job.id)}
                  className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/10 hover:border-red-600/40 hover:bg-white/[0.05] cursor-pointer transition-all group"
                >
                  <div>
                    <h3 className="font-bold group-hover:text-red-500 transition">{job.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {job.jobType && (
                        <span className="bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{job.jobType}</span>
                      )}
                      {job.salary && <span className="text-green-400 font-semibold">{job.salary}</span>}
                      <span>{Math.floor((Date.now() - new Date(job.createdAt)) / 86400000)}d atras</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-red-500 font-bold text-lg">{job._count?.applications || 0}</p>
                    <p className="text-gray-600 text-xs">postulantes</p>
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

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 mb-1">{icon}<p className="text-gray-500 text-xs">{label}</p></div>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}
