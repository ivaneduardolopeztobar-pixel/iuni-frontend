import { useState, useEffect } from "react";
import { Bell, BellOff, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

const JOB_TYPES = ["", "Tiempo completo", "Medio tiempo", "Pasantia", "Por proyecto", "Freelance"];

export default function JobAlerts() {
  const [alert, setAlert] = useState({ keywords: "", jobType: "", city: "", active: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.get("/alerts").then(r => {
      if (r.data) setAlert(r.data);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/alerts", alert);
      setAlert(data);
      showToast("Alerta guardada exitosamente");
    } catch { alert("Error al guardar"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Alertas de empleo</h1>
            <p className="text-gray-500 text-sm">Recibe emails cuando se publiquen empleos que te interesan</p>
          </div>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 space-y-6">

          {/* Toggle activo */}
          <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              {alert.active
                ? <Bell size={20} className="text-red-500" />
                : <BellOff size={20} className="text-gray-600" />
              }
              <div>
                <p className="font-semibold text-sm">Alertas activas</p>
                <p className="text-gray-500 text-xs">
                  {alert.active ? "Recibes emails de nuevas ofertas" : "No recibes emails"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAlert(a => ({ ...a, active: !a.active }))}
              className={"relative w-12 h-6 rounded-full transition-colors " + (alert.active ? "bg-red-600" : "bg-gray-700")}
            >
              <div className={"absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform " + (alert.active ? "translate-x-6" : "translate-x-0.5")} />
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Palabras clave</label>
              <input
                value={alert.keywords || ""}
                onChange={e => setAlert(a => ({ ...a, keywords: e.target.value }))}
                placeholder="Ej: desarrollador, diseñador, QA..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
              />
              <p className="text-gray-600 text-xs mt-1">Busca en el titulo y descripcion del empleo</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Tipo de empleo</label>
              <select
                value={alert.jobType || ""}
                onChange={e => setAlert(a => ({ ...a, jobType: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600 transition"
              >
                <option value="">Cualquier tipo</option>
                {JOB_TYPES.filter(t => t).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Ciudad</label>
              <input
                value={alert.city || ""}
                onChange={e => setAlert(a => ({ ...a, city: e.target.value }))}
                placeholder="Ej: San Salvador, Santa Ana..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-white/[0.04] rounded-xl border border-white/10">
            <p className="text-xs text-gray-500 mb-2 font-medium">RECIBIRIAS ALERTAS DE:</p>
            <p className="text-sm text-gray-300">
              {alert.keywords ? ("Empleos con " + alert.keywords) : "Todos los empleos"}
              {alert.jobType ? " de tipo " + alert.jobType : ""}
              {alert.city ? " en " + alert.city : ""}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar configuracion"}
          </button>
        </div>
      </div>
    </div>
  );
}
