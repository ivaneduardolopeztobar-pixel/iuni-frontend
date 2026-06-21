import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Globe, Car, Plane, FileText, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import api from "../api/client";

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
      <p className="text-gray-500 text-sm">Cargando perfil...</p>
    </div>
  );

  const photoUrl = student?.photoPath || null;
  const cvUrl = student?.cvPath || null;

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title={student ? student.firstName + " " + student.lastName : "Perfil"} description="Perfil de estudiante en iUNI" />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden animate-fade-in">

          {/* Header */}
          <div className="bg-gradient-to-r from-white/[0.04] to-transparent p-6 md:p-8 border-b border-white/10">
            <div className="flex flex-col md:flex-row items-start gap-5">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-red-600/50 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-3xl font-black shrink-0 shadow-lg shadow-red-600/20">
                  {student?.firstName?.[0]}{student?.lastName?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black">
                  {student?.firstName} {student?.lastName}
                </h1>
                {student?.desiredPosition && (
                  <p className="text-red-500 font-semibold mt-0.5">{student.desiredPosition}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                  {student?.city && (
                    <span className="flex items-center gap-1"><MapPin size={11} />{student.city}{student.country ? ", " + student.country : ""}</span>
                  )}
                  {student?.user?.email && (
                    <span className="flex items-center gap-1"><Mail size={11} />{student.user.email}</span>
                  )}
                  {student?.career && (
                    <span className="flex items-center gap-1"><Briefcase size={11} />{student.career}</span>
                  )}
                </div>
              </div>
              {cvUrl && React.createElement(
                "a",
                { href: cvUrl, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-lg shadow-red-600/20" },
                React.createElement(FileText, { size: 14 }),
                " Descargar CV"
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">

            {student?.profileDescription && (
              <Section title="Acerca de">
                <p className="text-gray-300 text-sm leading-relaxed">{student.profileDescription}</p>
              </Section>
            )}

            {student?.technicalSkills && (
              <Section title="Habilidades tecnicas">
                <div className="flex flex-wrap gap-2">
                  {student.technicalSkills.split(",").map((s, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {student?.softSkills && (
              <Section title="Habilidades blandas">
                <div className="flex flex-wrap gap-2">
                  {student.softSkills.split(",").map((s, i) => (
                    <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-3 py-1.5 rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {student?.hasWorkExperience && student?.workExperience && (
              <Section title="Experiencia laboral">
                <p className="text-gray-300 text-sm leading-relaxed">{student.workExperience}</p>
              </Section>
            )}

            <Section title="Informacion adicional">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student?.languages && (
                  <InfoItem icon={<Globe size={14} />} label="Idiomas" value={student.languages} />
                )}
                {student && (
                  <InfoItem icon={<Plane size={14} />} label="Disponible para viajar" value={student.willingToTravel ? "Si" : "No"} />
                )}
                {student && (
                  <InfoItem icon={<Car size={14} />} label="Licencia de conducir" value={student.hasDriverLicense ? "Si" : "No"} />
                )}
                {student?.phone && (
                  <InfoItem icon={<Mail size={14} />} label="Telefono" value={student.phone} />
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
      <h3 className="font-bold text-white mb-3 pb-2 border-b border-white/10">{title}</h3>
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
