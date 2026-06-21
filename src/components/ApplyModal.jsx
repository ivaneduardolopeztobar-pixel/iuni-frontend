import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, User, FileText, Briefcase } from "lucide-react";
import api from "../api/client";

export default function ApplyModal({ jobId, jobTitle, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get("/student/profile")
      .then(r => setProfile(r.data))
      .finally(() => setLoading(false));
  }, []);

  const checks = profile ? [
    {
      label: "Nombre completo",
      ok: !!(profile.firstName && profile.lastName),
      fix: "/student/profile"
    },
    {
      label: "Puesto deseado",
      ok: !!profile.desiredPosition,
      fix: "/onboarding"
    },
    {
      label: "Carrera universitaria",
      ok: !!profile.career,
      fix: "/onboarding"
    },
    {
      label: "Habilidades tecnicas",
      ok: !!profile.technicalSkills,
      fix: "/student/profile"
    },
    {
      label: "CV subido",
      ok: !!profile.cvPath,
      fix: "/student/profile"
    },
  ] : [];

  const completed = checks.filter(c => c.ok).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const canApply = pct >= 60;

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post("/applications/" + jobId + "/apply");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || "Error al postular");
    } finally { setApplying(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-black text-lg text-white">Postularse a</h2>
          <p className="text-red-500 font-semibold text-sm mt-0.5 truncate">{jobTitle}</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Verificando perfil...</div>
        ) : (
          <div className="p-6 space-y-4">

            {/* Barra de progreso del perfil */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">Completitud del perfil</p>
                <p className={"text-sm font-black " + (pct >= 60 ? "text-green-400" : "text-yellow-400")}>
                  {pct}%
                </p>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-2">
                <div
                  className={"h-2 rounded-full transition-all " + (pct >= 60 ? "bg-green-500" : "bg-yellow-500")}
                  style={{ width: pct + "%" }}
                />
              </div>
              {!canApply && (
                <p className="text-yellow-500 text-xs mt-2 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Necesitas al menos 60% para postularte
                </p>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {check.ok
                      ? <CheckCircle size={16} className="text-green-400 shrink-0" />
                      : <XCircle size={16} className="text-gray-600 shrink-0" />
                    }
                    <span className={"text-sm " + (check.ok ? "text-white" : "text-gray-500")}>
                      {check.label}
                    </span>
                  </div>
                  {!check.ok && (
                    <button
                      onClick={() => { onClose(); navigate(check.fix); }}
                      className="text-xs text-red-500 hover:text-red-400 transition"
                    >
                      Agregar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-700 text-gray-400 hover:text-white font-bold py-3 rounded-xl transition text-sm"
              >
                Cancelar
              </button>
              {canApply ? (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 text-sm"
                >
                  {applying ? "Enviando..." : "Postularme"}
                </button>
              ) : (
                <button
                  onClick={() => { onClose(); navigate("/onboarding"); }}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  Completar perfil
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
