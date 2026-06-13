import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Globe, Car, Plane, FileText, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

const BASE = "http://localhost:3001";

export default function StudentPublicProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/public/" + studentId)
      .then(r => setStudent(r.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando perfil...</p>
    </div>
  );

  const photoUrl = student && student.photoPath
    ? student.photoPath
    : null;

  const cvUrl = student && student.cvPath
    ? student.cvPath
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition text-sm"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-950 p-8 border-b border-gray-800">
            <div className="flex items-start gap-5">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto"
                  className="w-20 h-20 rounded-full object-cover border-2 border-red-600 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-3xl font-black shrink-0">
                  {student && student.firstName && student.firstName[0]}
                  {student && student.lastName && student.lastName[0]}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-black">
                  {student && student.firstName} {student && student.lastName}
                </h1>
                {student && student.desiredPosition && (
                  <p className="text-red-500 font-semibold mt-0.5">{student.desiredPosition}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                  {student && student.city && (
                    <span className="flex items-center gap-1"><MapPin size={11} />{student.city}{student.country ? ", " + student.country : ""}</span>
                  )}
                  {student && student.user && student.user.email && (
                    <span className="flex items-center gap-1"><Mail size={11} />{student.user.email}</span>
                  )}
                  {student && student.career && (
                    <span className="flex items-center gap-1"><Briefcase size={11} />{student.career}</span>
                  )}
                </div>
              </div>
              {cvUrl && React.createElement(
                "a",
                { href: cvUrl, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shrink-0" },
                React.createElement(FileText, { size: 14 }),
                " Descargar CV"
              )}
            </div>
          </div>

          <div className="p-8 space-y-6">

            {/* Descripcion */}
            {student && student.profileDescription && (
              <Section title="Acerca de">
                <p className="text-gray-300 text-sm leading-relaxed">{student.profileDescription}</p>
              </Section>
            )}

            {/* Habilidades */}
            {student && student.technicalSkills && (
              <Section title="Habilidades tecnicas">
                <div className="flex flex-wrap gap-2">
                  {student.technicalSkills.split(",").map((s, i) => (
                    <span key={i} className="bg-gray-900 border border-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {student && student.softSkills && (
              <Section title="Habilidades blandas">
                <div className="flex flex-wrap gap-2">
                  {student.softSkills.split(",").map((s, i) => (
                    <span key={i} className="bg-red-950 border border-red-900 text-red-300 text-xs px-3 py-1 rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Experiencia */}
            {student && student.hasWorkExperience && student.workExperience && (
              <Section title="Experiencia laboral">
                <p className="text-gray-300 text-sm leading-relaxed">{student.workExperience}</p>
              </Section>
            )}

            {/* Info adicional */}
            <Section title="Informacion adicional">
              <div className="grid grid-cols-2 gap-4">
                {student && student.languages && (
                  <InfoItem icon={<Globe size={14}/>} label="Idiomas" value={student.languages} />
                )}
                {student && (
                  <InfoItem icon={<Plane size={14}/>} label="Disponible para viajar" value={student.willingToTravel ? "Si" : "No"} />
                )}
                {student && (
                  <InfoItem icon={<Car size={14}/>} label="Licencia de conducir" value={student.hasDriverLicense ? "Si" : "No"} />
                )}
                {student && student.phone && (
                  <InfoItem icon={<Mail size={14}/>} label="Telefono" value={student.phone} />
                )}
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-bold text-white mb-3 pb-2 border-b border-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-red-500 mt-0.5">{icon}</span>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white text-sm">{value}</p>
      </div>
    </div>
  );
}
