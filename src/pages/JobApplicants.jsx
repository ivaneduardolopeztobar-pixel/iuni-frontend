import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/client';

const STATUS_CONFIG = {
  POSTULADO:   { label: 'Postulado',   cls: 'bg-blue-950 text-blue-300 border-blue-800',   icon: <Clock size={12}/> },
  EN_REVISION: { label: 'En revisión', cls: 'bg-yellow-950 text-yellow-300 border-yellow-800', icon: <Eye size={12}/> },
  ACEPTADO:    { label: 'Aceptado',    cls: 'bg-green-950 text-green-300 border-green-800', icon: <CheckCircle size={12}/> },
  RECHAZADO:   { label: 'Rechazado',   cls: 'bg-red-950 text-red-400 border-red-800',      icon: <XCircle size={12}/> },
};

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleViewProfile = async (app) => {
    const isOpening = selected?.id !== app.id;
    setSelected(isOpening ? app : null);
    if (isOpening) {
      try {
        await api.post("/views/student/" + app.student.id);
      } catch {}
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
      setApplicants(prev =>
        prev.map(a => a.id === appId ? { ...a, status: data.status } : a)
      );
    } catch (e) {
      alert('Error al actualizar estado');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/employer/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition text-sm">
          <ArrowLeft size={16} /> Volver a publicaciones
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-black">{jobTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">{applicants.length} postulante{applicants.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="bg-gray-950 rounded-xl h-24 animate-pulse" />)}
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <User size={48} className="mx-auto mb-4 opacity-30" />
            <p>Nadie ha aplicado a esta vacante aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applicants.map(app => {
              const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.POSTULADO;
              const days = Math.floor((Date.now() - new Date(app.createdAt)) / 86400000);
              return (
                <div key={app.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full shrink-0 overflow-hidden">
                        {app.student && app.student.photoPath ? (
                          <img
                            src={app.student.photoPath}
                            alt="Foto"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center font-black text-sm">
                            {app.student && app.student.firstName && app.student.firstName[0]}
                            {app.student && app.student.lastName && app.student.lastName[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{app.student?.firstName} {app.student?.lastName}</h3>
                        {app.student?.career && (
                          <p className="text-gray-400 text-sm">{app.student.career}</p>
                        )}
                        {app.student?.desiredPosition && (
                          <p className="text-red-500 text-xs">{app.student.desiredPosition}</p>
                        )}
                        <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                          <Calendar size={11}/>
                          Aplicó hace {days} día{days !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Status + actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${s.cls}`}>
                        {s.icon} {s.label}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => { handleViewProfile(app); navigate("/student/public/" + app.student.id); }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition"
                        >
                          Ver perfil
                        </button>
                        {app.status !== 'ACEPTADO' && (
                          <button
                            onClick={() => changeStatus(app.id, 'ACEPTADO')}
                            disabled={updating === app.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-900 border border-green-700 text-green-300 hover:bg-green-800 transition disabled:opacity-50"
                          >
                            Aceptar
                          </button>
                        )}
                        {app.status !== 'RECHAZADO' && (
                          <button
                            onClick={() => changeStatus(app.id, 'RECHAZADO')}
                            disabled={updating === app.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 transition disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        )}
                        {app.status === 'POSTULADO' && (
                          <button
                            onClick={() => changeStatus(app.id, 'EN_REVISION')}
                            disabled={updating === app.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-yellow-950 border border-yellow-800 text-yellow-300 hover:bg-yellow-900 transition disabled:opacity-50"
                          >
                            En revisión
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandible: perfil del estudiante */}
                  {selected?.id === app.id && (
                    <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-3 text-sm">
                      {app.student?.phone && <Info label="Teléfono" value={app.student.phone} />}
                      {app.student?.city && <Info label="Ciudad" value={app.student.city} />}
                      {app.student?.languages && <Info label="Idiomas" value={app.student.languages} />}
                      {app.student?.technicalSkills && <Info label="Habilidades técnicas" value={app.student.technicalSkills} />}
                      {app.student?.softSkills && <Info label="Habilidades blandas" value={app.student.softSkills} />}
                      {app.student?.profileDescription && (
                        <div className="col-span-2">
                          <Info label="Descripción" value={app.student.profileDescription} />
                        </div>
                      )}
                      {app.student?.cvPath && (
                        <div className="col-span-2">
                          <a href={app.student.cvPath} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
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
