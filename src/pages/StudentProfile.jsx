import { useState, useEffect, useRef } from "react";
import { Camera, Upload, FileText, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import ProfileCompletionBar from "../components/ProfileCompletionBar";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const BASE = "http://localhost:3001";

const FIELDS = [
  ["firstName","Nombre"], ["lastName","Apellido"], ["phone","Telefono"],
  ["city","Ciudad"], ["country","Pais"], ["desiredPosition","Puesto deseado"],
  ["career","Carrera"], ["languages","Idiomas"],
  ["technicalSkills","Habilidades tecnicas"], ["softSkills","Habilidades blandas"],
];

export default function StudentProfile() {
  const { updatePhoto } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [toast, setToast] = useState("");
  const photoRef = useRef();
  const cvRef = useRef();

  useEffect(() => {
    api.get("/student/profile")
      .then(r => { setProfile(r.data); setForm(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/student/profile", form);
      setProfile(data);
      setEditing(false);
      showToast("Perfil actualizado");
    } catch { alert("Error al guardar"); }
    finally { setSaving(false); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const { data } = await api.post("/upload/student/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(p => ({ ...p, photoPath: data.photoPath }));
      updatePhoto(data.photoPath);
      showToast("Foto actualizada");
    } catch { alert("Error al subir foto"); }
    finally { setUploadingPhoto(false); }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCV(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const { data } = await api.post("/upload/student/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(p => ({ ...p, cvPath: data.cvPath }));
      showToast("CV subido exitosamente");
    } catch { alert("Error al subir CV"); }
    finally { setUploadingCV(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando perfil...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorMsg onRetry={() => { setError(false); setLoading(true); api.get("/student/profile").then(r => { setProfile(r.data); setForm(r.data); }).catch(() => setError(true)).finally(() => setLoading(false)); }} />
      </div>
    </div>
  );

  const photoUrl = profile && profile.photoPath
    ? profile.photoPath
    : null;

  const cvUrl = profile && profile.cvPath
    ? profile.cvPath
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Mi CV</h1>
          <div className="flex gap-2">
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm transition-all">
                Cancelar
              </button>
            )}
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50 shadow-lg shadow-red-600/20"
            >
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Editar perfil"}
            </button>
          </div>
        </div>

        <ProfileCompletionBar profile={profile} />

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-in">

          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              {photoUrl ? (
                <img src={photoUrl} alt="Foto" className="w-20 h-20 rounded-full object-cover border-2 border-red-600" />
              ) : (
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-2xl font-black">
                  {profile && profile.firstName && profile.firstName[0]}
                  {profile && profile.lastName && profile.lastName[0]}
                </div>
              )}
              <button
                onClick={() => photoRef.current.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#111] border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-red-600/50 transition-all"
              >
                {uploadingPhoto
                  ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera size={13} className="text-white" />
                }
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {profile && profile.firstName} {profile && profile.lastName}
              </h2>
              <p className="text-gray-500 text-sm">
                {profile && profile.user && profile.user.email}
              </p>
              {profile && profile.desiredPosition && (
                <p className="text-red-500 text-sm mt-0.5">{profile.desiredPosition}</p>
              )}
            </div>
          </div>

          <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-red-500" />
                <div>
                  <p className="text-sm font-semibold">Curriculum Vitae</p>
                  <p className="text-xs text-gray-500">
                    {profile && profile.cvPath ? "CV subido" : "Sin CV subido"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {cvUrl && (
                  <a href={cvUrl} target="_blank" rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all">
                    Ver CV
                  </a>
                )}
                <button
                  onClick={() => cvRef.current.click()}
                  disabled={uploadingCV}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all disabled:opacity-50 shadow-md shadow-red-600/20"
                >
                  {uploadingCV
                    ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    : <Upload size={13} />
                  }
                  {uploadingCV ? "Subiendo..." : (profile && profile.cvPath ? "Actualizar CV" : "Subir CV")}
                </button>
                <input ref={cvRef} type="file" accept=".pdf" className="hidden" onChange={handleCVUpload} />
              </div>
            </div>
          </div>

          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map(([k, l]) => (
                <div key={k}>
                  <label className="text-gray-400 text-xs mb-1 block">{l}</label>
                  <input
                    value={form[k] || ""}
                    onChange={e => setForm({...form, [k]: e.target.value})}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-gray-400 text-xs mb-1 block">Descripción profesional</label>
                <textarea
                  value={form.profileDescription || ""}
                  onChange={e => setForm({...form, profileDescription: e.target.value})}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {profile && profile.profileDescription && (
                <Info title="Descripción" value={profile.profileDescription} />
              )}
              <div className="grid grid-cols-2 gap-4">
                {FIELDS.filter(([k]) => profile && profile[k]).map(([k, l]) => (
                  <Info key={k} title={l} value={profile[k]} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-0.5">{title}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}
