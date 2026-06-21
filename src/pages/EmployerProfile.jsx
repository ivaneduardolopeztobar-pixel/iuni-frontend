import { useState, useEffect, useRef } from "react";
import { Camera, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const BASE = "http://localhost:3001";

const FIELDS = [
  ["companyName","Empresa"], ["repName","Representante"],
  ["phone","Telefono"], ["city","Ciudad"], ["country","Pais"],
  ["sector","Sector empresarial"], ["workerCount","No. de trabajadores"],
];

export default function EmployerProfile() {
  const { updatePhoto } = useAuth();
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toast, setToast] = useState("");
  const logoRef = useRef();

  useEffect(() => {
    api.get("/employer/profile").then(r => setForm(r.data)).finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/employer/profile", form);
      setEditing(false);
      showToast("Perfil actualizado");
    } catch { alert("Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const { data } = await api.post("/upload/employer/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(f => ({ ...f, photoPath: data.photoPath }));
      updatePhoto(data.photoPath);
      showToast("Logo actualizado");
    } catch { alert("Error al subir logo"); }
    finally { setUploadingLogo(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  );

  const logoUrl = form.photoPath ? form.photoPath : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-black">Perfil de Empresa</h1>
          <div className="flex gap-2 w-full md:w-auto">
            {editing && (
              <button onClick={() => setEditing(false)} className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/30 transition-all">
                Cancelar
              </button>
            )}
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50 shadow-lg shadow-red-600/20"
            >
              {saving ? "Guardando..." : editing ? "Guardar" : "Editar"}
            </button>
          </div>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-in">

          {/* Logo empresa */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-20 h-20 rounded-xl object-cover border-2 border-red-600" />
              ) : (
                <div className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center text-3xl font-black">
                  {form.companyName && form.companyName[0]}
                </div>
              )}
              <button
                onClick={() => logoRef.current.click()}
                disabled={uploadingLogo}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#111] border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-red-600/50 transition-all"
              >
                {uploadingLogo
                  ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera size={13} className="text-white" />
                }
              </button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{form.companyName}</h2>
              <p className="text-gray-500 text-sm">{form.user && form.user.email}</p>
              {form.sector && <p className="text-red-500 text-sm mt-0.5">{form.sector}</p>}
            </div>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FIELDS.map(([k, l]) => (
              <div key={k}>
                <label className="text-gray-500 text-xs mb-1 block">{l}</label>
                {editing ? (
                  <input
                    value={form[k] || ""}
                    onChange={e => setForm({...form, [k]: e.target.value})}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
                  />
                ) : (
                  <p className="text-sm text-white">{form[k] || <span className="text-gray-700">Sin especificar</span>}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
