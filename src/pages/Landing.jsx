import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Users, Star, ArrowRight, CheckCircle, ShieldCheck, GraduationCap } from "lucide-react";
import SEO from "../components/SEO";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEO
        title="Encuentra tu primer empleo"
        description="iUNI conecta estudiantes universitarios de El Salvador con empresas que buscan talento joven. Registrate gratis con tu correo institucional."
      />

      {/* Navbar */}
      <nav className="px-6 py-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-lg z-50">
        <h1 className="text-2xl font-black tracking-tight"><span className="text-red-600">i</span>UNI</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition-all"
          >
            Iniciar sesion
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
        {/* Glow decorativo de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <GraduationCap size={13} className="text-red-500" /> Exclusivo para estudiantes universitarios
          </div>
          <h2 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6 text-balance">
            Encuentra tu primer<br />
            <span className="text-red-600">empleo profesional</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            La plataforma de empleo que conecta estudiantes universitarios verificados
            con empresas que buscan talento joven en El Salvador.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-xl shadow-red-600/25 hover:shadow-red-500/30 hover:-translate-y-0.5"
            >
              Soy estudiante <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              Soy empleador <ArrowRight size={18} />
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-6">
            Requiere correo institucional universitario (.edu.sv) para estudiantes
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 py-14 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-4 md:gap-8 text-center">
          <Stat number="9+" label="Universidades verificadas" />
          <Stat number="100%" label="Gratis para estudiantes" />
          <Stat number="24/7" label="Disponible siempre" />
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h3 className="text-3xl md:text-4xl font-black mb-3">Como funciona</h3>
          <p className="text-gray-500">Tres pasos para encontrar tu empleo ideal</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Step number="1" title="Crea tu perfil" desc="Registrate con tu correo institucional, completa tu perfil academico y sube tu CV." />
          <Step number="2" title="Busca empleos" desc="Explora vacantes filtradas por puesto, ciudad y tipo de empleo en tiempo real." />
          <Step number="3" title="Postulate" desc="Aplica con un click y recibe notificaciones del estado de tu postulacion." />
        </div>
      </section>

      {/* Para empleadores */}
      <section className="relative bg-white/[0.02] border-y border-white/5 py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
          <div className="flex-1 min-w-72">
            <p className="text-red-500 text-sm font-bold mb-3 tracking-wide">PARA EMPLEADORES</p>
            <h3 className="text-3xl md:text-4xl font-black mb-5 leading-tight">Encuentra el talento<br />que necesitas</h3>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Publica tus vacantes y recibe postulaciones de estudiantes universitarios
              verificados. Gestiona todo el proceso desde un panel intuitivo.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Estudiantes con correo institucional verificado",
                "Revision de CV y perfil de candidatos",
                "Metricas y estadisticas de tus publicaciones",
                "Badge de empresa verificada"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-red-500 shrink-0" /> {f}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/register")}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20"
            >
              Registrar empresa
            </button>
          </div>
          <div className="flex-1 min-w-64 grid grid-cols-2 gap-3 w-full">
            <Card icon={<Briefcase size={22} className="text-red-500" />} title="Publica empleos" desc="Ofertas detalladas con requisitos y beneficios" />
            <Card icon={<Users size={22} className="text-red-500" />} title="Ve postulantes" desc="Perfiles y CVs en un solo lugar" />
            <Card icon={<ShieldCheck size={22} className="text-red-500" />} title="Verificación" desc="Badge de confianza para tu empresa" />
            <Card icon={<Star size={22} className="text-red-500" />} title="Metricas" desc="Estadisticas de tus publicaciones" />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <h3 className="text-3xl md:text-4xl font-black mb-4">Listo para comenzar?</h3>
        <p className="text-gray-400 mb-9">Unete a la red de empleo exclusiva para estudiantes universitarios de El Salvador</p>
        <button
          onClick={() => navigate("/register")}
          className="bg-red-600 hover:bg-red-500 text-white font-black px-10 py-4 rounded-xl transition-all text-lg shadow-xl shadow-red-600/25 hover:-translate-y-0.5"
        >
          Crear cuenta gratis
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10 text-center">
        <p className="text-xl font-black text-white mb-3"><span className="text-red-600">i</span>UNI</p>
        <p className="text-gray-600 text-sm">Plataforma de empleo estudiantil universitaria — El Salvador</p>
        <p className="text-gray-700 text-xs mt-1">2026 — Todos los derechos reservados</p>
        <Link to="/terms" className="text-gray-600 hover:text-gray-400 text-xs mt-3 inline-block transition">Terminos y Privacidad</Link>
      </footer>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="text-3xl md:text-4xl font-black text-red-600">{number}</p>
      <p className="text-gray-500 text-xs md:text-sm mt-1.5">{label}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-all">
      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-lg mb-5 shadow-lg shadow-red-600/20">
        {number}
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
