import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const FIELDS_WEIGHT = [
  { key: "firstName", weight: 10 },
  { key: "lastName", weight: 10 },
  { key: "phone", weight: 5 },
  { key: "city", weight: 5 },
  { key: "career", weight: 15 },
  { key: "desiredPosition", weight: 15 },
  { key: "technicalSkills", weight: 15 },
  { key: "softSkills", weight: 5 },
  { key: "profileDescription", weight: 10 },
  { key: "cvPath", weight: 10 },
];

export function calculateProfileCompletion(profile) {
  if (!profile) return 0;
  let score = 0;
  FIELDS_WEIGHT.forEach(f => {
    if (profile[f.key]) score += f.weight;
  });
  return Math.min(100, score);
}

export default function ProfileCompletionBar({ profile, compact = false }) {
  const navigate = useNavigate();
  const pct = calculateProfileCompletion(profile);

  if (pct >= 100) return null;

  const missingFields = FIELDS_WEIGHT.filter(f => !profile?.[f.key]);
  const nextField = missingFields[0];

  const fieldLabels = {
    firstName: "tu nombre", lastName: "tu apellido", phone: "tu telefono",
    city: "tu ciudad", career: "tu carrera", desiredPosition: "el puesto deseado",
    technicalSkills: "tus habilidades tecnicas", softSkills: "tus habilidades blandas",
    profileDescription: "tu descripcion profesional", cvPath: "tu CV"
  };

  if (compact) {
    return (
      <button
        onClick={() => navigate("/student/profile")}
        className="flex items-center gap-2 bg-yellow-950 border border-yellow-900 text-yellow-400 text-xs px-3 py-1.5 rounded-full hover:bg-yellow-900 transition"
      >
        <AlertCircle size={12} />
        Perfil {pct}% completo
      </button>
    );
  }

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-sm">Tu perfil esta {pct}% completo</p>
        <p className={"text-sm font-black " + (pct >= 70 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400")}>
          {pct}%
        </p>
      </div>
      <div className="w-full bg-gray-900 rounded-full h-2 mb-3">
        <div
          className={"h-2 rounded-full transition-all " + (pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500")}
          style={{ width: pct + "%" }}
        />
      </div>
      {nextField && (
        <button
          onClick={() => navigate("/student/profile")}
          className="text-red-500 hover:text-red-400 text-xs font-semibold transition"
        >
          Agrega {fieldLabels[nextField.key]} para mejorar tu perfil →
        </button>
      )}
    </div>
  );
}
