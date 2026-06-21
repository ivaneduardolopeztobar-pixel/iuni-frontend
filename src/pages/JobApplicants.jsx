import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle, Clock, Eye, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import api from '../api/client';

const STATUS_CONFIG = {
  POSTULADO:   { label: 'Postulado',   cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20',   icon: <Clock size={12} /> },
  EN_REVISION: { label: 'En revisión', cls: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20', icon: <Eye size={12} /> },
  ACEPTADO:    { label: 'Aceptado',    cls: 'bg-green-500/10 text-green-300 border-green-500/20', icon: <CheckCircle size={12} /> },
  RECHAZADO:   { label: 'Rechazado',   cls: 'bg-red-500/10 text-red-400 border-red-500/20',      icon: <XCircle size={12} /> },
};

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = async (app) => {
    const isOpening = expanded?.id !== app.id;
    setExpanded(isOpening ? app : null);
    if (isOpening) {
      try { await api.post("/views/student/" + app.student.id); } catch {}
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [appsRes, jobRes] = await Promise.all([
          api.get(`/applications/${jobId}/list`),
          api.get(`/jobs/${jobId}`)
        ]);
        setApplicants(appsRes.data);
        setJobTitle(jobRes.data.title);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const changeStatus = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      const { data } = await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: data.status } : a));
    } catch (e) {
      alert('Error al actualizar estado');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Postulantes" description="Revisa los candidatos a tu oferta de empleo en iUNI" />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/employer/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Volver a publicaciones
        </button>

        <div className="mb-7 animate-fade-in">
          <h1 className="text-2xl font-black">{jobTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">{applicants.length} postulante{applicants.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-fade-in">
            <User size={40} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500">Nadie ha aplicado a esta vacante aun</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applicants.map((app, i) => {
              const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.POSTULADO;
              const days = Math.floor((Date.now() - new Date(app.createdAt)) / 86400000);
              const isExpanded = expanded?.id === app.id;
              return (
                <div
                  key={app.id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all animate-slide-up"
                  style={{ animationDelay: i * 40 + "ms" }}
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-full shrink-0 overflow-hidden ring-2 ring-white/10">
                        {app.student && app.student.photoPath ? (
                          <img src={app.student.photoPath} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center font-black text-sm">
                            {app.student && app.student.firstName && app.student.firstName[0]}
                            {app.student && app.student.lastName && app.student.lastName[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold truncate">{app.student?.firstName} {app.student?.lastName}</h3>
                        {app.student?.career && (
                          <p className="text-gray-400 text-sm truncate">{app.student.career}</p>
                        )}
                        {app.student?.desiredPosition && (
                          <p className="text-red-500 text-xs font-medium">{app.student.desiredPosition}</p>
                        )}
                        <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                          <Calendar size={11} />
                          Aplicó hace {days} día{days !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${s.cls}`}>
                        {s.icon} {s.label}
                      </span>

                      <div className="flex gap-2 flex-wrap justify-end">
                        <button
                          onClick={() => toggleExpand(app)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all"
                        >
                          Vista rapida <ChevronDown size={12} className={isExpanded ? "rotate-180 transition-transform" : "transition-transform"} />
                        </button>
                        <button
                          onClick={() => navigate("/student/public/" + app.student.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all"
                        >
                          Ver perfil completo
                        </button>
                        {app.status !== 'ACEPTADO' && (
                          <button
                            onClick={() => changeStatus(app.id, 'ACEPTADO')}
                            disabled={updating === app.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20 transition-all disabled:opacity-50"
                          >
                            Aceptar
                          </button>
                        )}
                        {app.status !== 'RECHAZADO' && (
                          <button
                            onClick={() => changeStatus(app.id, 'RECHAZADO')}
                            disabled={updating === app.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        )}
                        {app.status === 'POSTULADO' && (
                          <button
                            onClick={() => changeStatus(app.id, 'EN_REVISION')}
                            disabled={updating === app.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-all disabled:opacity-50"
                          >
                            En revisión
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm animate-slide-up">
                      {app.student?.phone && <Info label="Teléfono" value={app.student.phone} />}
                      {app.student?.city && <Info label="Ciudad" value={app.student.city} />}
                      {app.student?.languages && <Info label="Idiomas" value={app.student.languages} />}
                      {app.student?.technicalSkills && <Info label="Habilidades técnicas" value={app.student.technicalSkills} />}
                      {app.student?.softSkills && <Info label="Habilidades blandas" value={app.student.softSkills} />}
                      {app.student?.profileDescription && (
                        <div className="col-span-1 md:col-span-2">
                          <Info label="Descripción" value={app.student.profileDescription} />
                        </div>
                      )}
                      {app.student?.cvPath && (
                        <div className="col-span-1 md:col-span-2">
                          <a href={app.student.cvPath} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-red-600/20">
                            Descargar CV
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}
