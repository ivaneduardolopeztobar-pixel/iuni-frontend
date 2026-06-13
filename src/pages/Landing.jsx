import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { Briefcase, Users, Star, ArrowRight, CheckCircle } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Encuentra tu primer empleo"
        description="iUNI conecta estudiantes universitarios de El Salvador con empresas que buscan talento joven. Registrate gratis."
      />

      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-900">
        <h1 className="text-2xl font-black"><span className="text-red-600">i</span>UNI</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition"
          >
            Iniciar sesion
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 rounded-xl transition"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-red-950 border border-red-900 text-red-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <Star size={12} /> La red de empleo virtual para estudiantes
        </div>
        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
          Encuentra tu primer<br />
          <span className="text-red-600">empleo profesional</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          IUNI conecta estudiantes universitarios con empresas que buscan talento joven.
          Postulate, gestiona tus aplicaciones y da el primer paso en tu carrera.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-xl transition text-base"
          >
            Soy estudiante <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 border border-gray-700 hover:border-red-600 text-white font-bold px-8 py-4 rounded-xl transition text-base"
          >
            Soy empleador <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 text-center">
          <Stat number="500+" label="Estudiantes registrados" />
          <Stat number="120+" label="Empresas activas" />
          <Stat number="800+" label="Empleos publicados" />
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-black text-center mb-4">Como funciona</h3>
        <p className="text-gray-500 text-center mb-12">Tres pasos para encontrar tu empleo ideal</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Step
            number="1"
            title="Crea tu perfil"
            desc="Registrate como estudiante, completa tu perfil academico y sube tu CV."
          />
          <Step
            number="2"
            title="Busca empleos"
            desc="Explora cientos de vacantes filtradas por puesto, ciudad y tipo de empleo."
          />
          <Step
            number="3"
            title="Postulate"
            desc="Aplica con un click y recibe notificaciones del estado de tu postulacion."
          />
        </div>
      </section>

      {/* Para empleadores */}
      <section className="bg-gray-950 border-y border-gray-800 py-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
          <div className="flex-1 min-w-72">
            <p className="text-red-500 text-sm font-bold mb-2">PARA EMPLEADORES</p>
            <h3 className="text-3xl font-black mb-4">Encuentra el talento<br />que necesitas</h3>
            <p className="text-gray-400 mb-6">
              Publica tus vacantes, recibe postulaciones de estudiantes calificados
              y gestiona todo el proceso desde un panel intuitivo.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Publicacion de ofertas ilimitadas",
                "Revision de CV y perfil de candidatos",
                "Cambio de estado de postulaciones",
                "Notificaciones automaticas"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-red-500 shrink-0" /> {f}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/register")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              Registrar empresa
            </button>
          </div>
          <div className="flex-1 min-w-64 grid grid-cols-2 gap-3">
            <Card icon={<Briefcase size={24} className="text-red-500" />} title="Publica empleos" desc="Crea ofertas detalladas con requisitos y beneficios" />
            <Card icon={<Users size={24} className="text-red-500" />} title="Ve postulantes" desc="Revisa perfiles y CVs de candidatos en un solo lugar" />
            <Card icon={<CheckCircle size={24} className="text-red-500" />} title="Gestiona estados" desc="Acepta, rechaza o marca en revision cada postulacion" />
            <Card icon={<Star size={24} className="text-red-500" />} title="Notificaciones" desc="Recibe alertas cuando alguien aplica a tus vacantes" />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h3 className="text-4xl font-black mb-4">Listo para comenzar?</h3>
        <p className="text-gray-400 mb-8">Unete a miles de estudiantes que ya encontraron su primer empleo con IUNI</p>
        <button
          onClick={() => navigate("/register")}
          className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-4 rounded-xl transition text-lg"
        >
          Crear cuenta gratis
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 px-6 py-8 text-center text-gray-600 text-sm">
        <p className="text-xl font-black text-white mb-2"><span className="text-red-600">i</span>UNI</p>
        <p>Universidad de El Salvador — Ingenieria en Desarrollo de Software</p>
        <p className="mt-1">2025 — Todos los derechos reservados</p>
      </footer>

    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="text-4xl font-black text-red-600">{number}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-lg mb-4">
        {number}
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
