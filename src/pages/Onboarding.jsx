import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, User, Briefcase, FileText, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const STEPS = [
  {
    id: 1,
    title: "Información basica",
    description: "Cuéntanos sobre ti",
    icon: <User size={24} />,
    fields: ["firstName", "lastName", "phone", "city", "country"]
  },
  {
    id: 2,
    title: "Perfil academico",
    description: "Tu carrera y habilidades",
    icon: <Briefcase size={24} />,
    fields: ["career", "desiredPosition", "technicalSkills", "softSkills", "languages"]
  },
  {
    id: 3,
    title: "Tu CV",
    description: "Sube tu curriculum vitae",
    icon: <FileText size={24} />,
    fields: ["cvPath"]
  }
];

export default function Onboarding() {
  const { user, updatePhoto } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", city: "", country: "El Salvador",
    career: "", desiredPosition: "", technicalSkills: "", softSkills: "",
    languages: "Español", profileDescription: ""
  });
  const [cvFile, setCvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  useEffect(() => {
    // Cargar datos existentes
    api.get("/student/profile").then(r => {
      const p = r.data;
      setForm(f => ({
        ...f,
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        phone: p.phone || "",
        city: p.city || "",
        country: p.country || "El Salvador",
        career: p.career || "",
        desiredPosition: p.desiredPosition || "",
        technicalSkills: p.technicalSkills || "",
        softSkills: p.softSkills || "",
        languages: p.languages || "Español",
        profileDescription: p.profileDescription || ""
      }));
      if (p.cvPath) setCvUploaded(true);
    }).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = async () => {
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.city) {
        alert("Por favor completa nombre, apellido y ciudad");
        return;
      }
    }
    if (step === 2) {
      if (!form.career || !form.desiredPosition) {
        alert("Por favor completa carrera y puesto deseado");
        return;
      }
      // Guardar datos
      setSaving(true);
      try {
        await api.put("/student/profile", form);
      } catch {}
      finally { setSaving(false); }
    }
    if (step < 3) {
      setStep(s => s + 1);
    }
  };

  const handleCVUpload = async () => {
    if (!cvFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      await api.post("/upload/student/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCvUploaded(true);
    } catch { alert("Error al subir CV"); }
    finally { setUploading(false); }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await api.put("/student/profile", form);
      // Marcar onboarding completado
      localStorage.setItem("onboardingDone_" + user.userId, "true");
      navigate("/home");
    } catch {}
    finally { setSaving(false); }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingDone_" + user.userId, "true");
    navigate("/home");
  };

  const progress = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black"><span className="text-red-600">i</span>UNI</h1>
        <button onClick={handleSkip} className="text-gray-600 hover:text-gray-400 text-sm transition">
          Completar despues
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Paso {step} de 3</p>
            <p className="text-sm text-gray-400">{Math.round(progress + 33)}% completado</p>
          </div>
          <div className="w-full bg-white/[0.04] rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: (step / 3 * 100) + "%" }}
            />
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all " +
                (step > s.id ? "bg-green-600 text-white" :
                 step === s.id ? "bg-red-600 text-white" :
                 "bg-white/[0.04] text-gray-600")}>
                {step > s.id ? <CheckCircle size={16} /> : s.id}
              </div>
              <div className="hidden md:block flex-1">
                <p className={"text-xs font-bold " + (step >= s.id ? "text-white" : "text-gray-600")}>{s.title}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={"h-0.5 flex-1 mx-2 " + (step > s.id ? "bg-green-600" : "bg-gray-800")} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8">

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black mb-1">Información basica</h2>
                <p className="text-gray-500 text-sm">Las empresas veran esta información en tu perfil</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre *" value={form.firstName} onChange={v => set("firstName", v)} />
                <Field label="Apellido *" value={form.lastName} onChange={v => set("lastName", v)} />
                <Field label="Telefono" value={form.phone} onChange={v => set("phone", v)} placeholder="7777-7777" />
                <Field label="Ciudad *" value={form.city} onChange={v => set("city", v)} placeholder="Santa Ana" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Descripción profesional</label>
                <textarea
                  value={form.profileDescription}
                  onChange={e => set("profileDescription", e.target.value)}
                  rows={3}
                  placeholder="Estudiante de 4to año de Ingeniería en Desarrollo de Software, apasionado por..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600 transition resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black mb-1">Perfil academico</h2>
                <p className="text-gray-500 text-sm">Información sobre tu carrera y habilidades</p>
              </div>
              <Field label="Carrera *" value={form.career} onChange={v => set("career", v)} placeholder="Ingenieria en Desarrollo de Software" />
              <Field label="Puesto de trabajo deseado *" value={form.desiredPosition} onChange={v => set("desiredPosition", v)} placeholder="Desarrollador Web, QA Tester, Diseñador UI..." />
              <Field label="Habilidades tecnicas" value={form.technicalSkills} onChange={v => set("technicalSkills", v)} placeholder="JavaScript, React, Node.js, SQL..." />
              <Field label="Habilidades blandas" value={form.softSkills} onChange={v => set("softSkills", v)} placeholder="Trabajo en equipo, comunicacion, liderazgo..." />
              <Field label="Idiomas" value={form.languages} onChange={v => set("languages", v)} placeholder="Español, Ingles basico..." />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black mb-1">Tu Curriculum Vitae</h2>
                <p className="text-gray-500 text-sm">Sube tu CV en PDF para que las empresas puedan revisarlo</p>
              </div>

              <div className={"border-2 border-dashed rounded-2xl p-8 text-center transition " +
                (cvUploaded ? "border-green-600 bg-green-950" : "border-white/10 hover:border-red-600")}>
                {cvUploaded ? (
                  <div>
                    <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                    <p className="font-bold text-green-400">CV subido exitosamente</p>
                    <p className="text-gray-500 text-sm mt-1">Puedes actualizarlo desde tu perfil cuando quieras</p>
                  </div>
                ) : (
                  <div>
                    <FileText size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="font-bold mb-1">Arrastra tu CV aqui</p>
                    <p className="text-gray-500 text-sm mb-4">o selecciona un archivo PDF (max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={e => setCvFile(e.target.files[0])}
                      className="hidden"
                      id="cv-input"
                    />
                    <label htmlFor="cv-input" className="cursor-pointer bg-white/[0.04] hover:bg-gray-800 border border-white/10 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition inline-block">
                      Seleccionar PDF
                    </label>
                    {cvFile && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm mb-3">{cvFile.name}</p>
                        <button
                          onClick={handleCVUpload}
                          disabled={uploading}
                          className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-50"
                        >
                          {uploading ? "Subiendo..." : "Subir CV"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="text-white font-bold">¿No tienes CV listo?</span> Puedes saltarte este paso
                  y subirlo mas tarde desde tu perfil. Sin embargo, tener un CV aumenta
                  significativamente tus chances de ser contactado.
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white font-bold py-3 rounded-xl transition text-sm"
              >
                Atras
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? "Guardando..." : "Continuar"} <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Ir a buscar empleos"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
      />
    </div>
  );
}
