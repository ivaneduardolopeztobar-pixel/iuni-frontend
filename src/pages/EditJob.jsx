import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

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
      <p className="text-gray-500">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-6">Editar Oferta</h1>
        <form onSubmit={handleSubmit} className="bg-gray-950 rounded-2xl p-8 border border-gray-800 space-y-5">
          <F label="Titulo del empleo *" value={form.title} onChange={v => set("title", v)} required />
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Descripcion *</label>
            <textarea
              value={form.description} onChange={e => set("description", e.target.value)}
              rows={4} required
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Tipo de empleo</label>
            <select
              value={form.jobType} onChange={e => set("jobType", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition text-sm"
            >
              {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <F label="Experiencia requerida" value={form.experienceRequired} onChange={v => set("experienceRequired", v)} />
            <F label="Nivel minimo de estudios" value={form.minEducation} onChange={v => set("minEducation", v)} />
            <F label="Habilidades tecnicas" value={form.technicalSkills} onChange={v => set("technicalSkills", v)} />
            <F label="Habilidades blandas" value={form.softSkills} onChange={v => set("softSkills", v)} />
            <F label="Condiciones laborales" value={form.workConditions} onChange={v => set("workConditions", v)} />
            <F label="Beneficios estudiantiles" value={form.studentBenefits} onChange={v => set("studentBenefits", v)} />
          </div>
          <F label="Compensacion / Salario" value={form.salary} onChange={v => set("salary", v)} placeholder="Ej: $400 - $600 / mes" />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/employer/dashboard")}
              className="flex-1 border border-gray-700 text-gray-400 hover:text-white font-bold py-3 rounded-xl transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 text-sm"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
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
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition text-sm"
      />
    </div>
  );
}
