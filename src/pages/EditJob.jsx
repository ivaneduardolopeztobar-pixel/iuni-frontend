import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, FileText, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import api from "../api/client";

const JOB_TYPES = ["Tiempo completo", "Medio tiempo", "Pasantia", "Por proyecto", "Freelance"];

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", jobType: "Tiempo completo",
    experienceRequired: "", minEducation: "", careerYear: "",
    technicalSkills: "", workConditions: "", studentBenefits: "",
    salary: "", softSkills: "",
  });

  useEffect(() => {
    api.get("/jobs/" + id).then(r => {
      const j = r.data;
      setForm({
        title: j.title || "",
        description: j.description || "",
        jobType: j.jobType || "Tiempo completo",
        experienceRequired: j.experienceRequired || "",
        minEducation: j.minEducation || "",
        careerYear: j.careerYear || "",
        technicalSkills: j.technicalSkills || "",
        workConditions: j.workConditions || "",
        studentBenefits: j.studentBenefits || "",
        salary: j.salary || "",
        softSkills: j.softSkills || "",
      });
    }).catch(() => navigate("/employer/dashboard"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/jobs/" + id, form);
      navigate("/employer/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Error al guardar");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500 text-sm">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Editar oferta" description="Edita tu oferta de empleo en iUNI" />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
            <Briefcase size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Editar oferta</h1>
            <p className="text-gray-500 text-sm mt-0.5">Actualiza la información de tu publicacion</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">

          <div className="bg-white/[0.03] rounded-2xl p-6 md:p-7 border border-white/10">
            <SectionTitle icon={<FileText size={14} />} title="Información del puesto" />
            <div className="space-y-5">
              <F label="Titulo del empleo *" value={form.title} onChange={v => set("title", v)} required />
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Descripción *</label>
                <textarea
                  value={form.description} onChange={e => set("description", e.target.value)}
                  rows={4} required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all resize-none text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Tipo de empleo</label>
                  <select
                    value={form.jobType} onChange={e => set("jobType", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 transition-all text-sm"
                  >
                    {JOB_TYPES.map(t => <option key={t} className="bg-[#0a0a0a]">{t}</option>)}
                  </select>
                </div>
                <F label="Compensacion / Salario" value={form.salary} onChange={v => set("salary", v)} placeholder="Ej: $400 - $600 / mes" />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-2xl p-6 md:p-7 border border-white/10">
            <SectionTitle icon={<Sparkles size={14} />} title="Requisitos y habilidades" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <F label="Experiencia requerida" value={form.experienceRequired} onChange={v => set("experienceRequired", v)} />
              <F label="Nivel minimo de estudios" value={form.minEducation} onChange={v => set("minEducation", v)} />
              <F label="Habilidades tecnicas" value={form.technicalSkills} onChange={v => set("technicalSkills", v)} />
              <F label="Habilidades blandas" value={form.softSkills} onChange={v => set("softSkills", v)} />
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-2xl p-6 md:p-7 border border-white/10">
            <SectionTitle icon={<Briefcase size={14} />} title="Condiciones y beneficios" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <F label="Condiciones laborales" value={form.workConditions} onChange={v => set("workConditions", v)} />
              <F label="Beneficios estudiantiles" value={form.studentBenefits} onChange={v => set("studentBenefits", v)} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/employer/dashboard")}
              className="flex-1 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-red-600/20"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
      <span className="text-red-500">{icon}</span>
      <h2 className="font-bold text-sm text-gray-200">{title}</h2>
    </div>
  );
}

function F({ label, value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1.5 block">{label}</label>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        required={required} placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all text-sm"
      />
    </div>
  );
}
