import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Terminos y Privacidad" description="Terminos de uso y politica de privacidad de iUNI" />

      <nav className="border-b border-gray-900 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black"><span className="text-red-600">i</span>UNI</h1>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-2">Terminos de Uso y Privacidad</h1>
        <p className="text-gray-500 text-sm mb-10">Ultima actualizacion: Junio 2026</p>

        <Section title="1. Sobre iUNI">
          iUNI es una plataforma de empleo exclusiva para estudiantes universitarios de El Salvador.
          Conectamos estudiantes con correos institucionales verificados con empresas que buscan
          talento joven. El servicio es gratuito para estudiantes.
        </Section>

        <Section title="2. Registro y elegibilidad">
          Para registrarse como estudiante se requiere un correo electronico institucional
          universitario activo (dominio .edu.sv). Esto garantiza que todos los candidatos
          son estudiantes universitarios verificados. Las empresas pueden registrarse con
          cualquier correo corporativo.
        </Section>

        <Section title="3. Uso de la plataforma">
          Los usuarios se comprometen a proporcionar información veridica en sus perfiles.
          Esta prohibido crear cuentas falsas, publicar ofertas fraudulentas o usar la
          plataforma para actividades ilegales. iUNI se reserva el derecho de suspender
          cuentas que violen estos terminos.
        </Section>

        <Section title="4. Datos personales">
          Recopilamos información necesaria para el funcionamiento de la plataforma:
          nombre, correo electronico, información academica y profesional. Esta información
          es compartida con empleadores unicamente cuando el estudiante decide postularse
          a una oferta. No vendemos datos personales a terceros.
        </Section>

        <Section title="5. Archivos subidos">
          Los CVs y fotografias subidos a la plataforma son almacenados de forma segura
          en Cloudinary. Los estudiantes pueden eliminar sus archivos en cualquier momento
          desde su perfil. Los empleadores solo pueden acceder a los CVs de estudiantes
          que se han postulado a sus ofertas.
        </Section>

        <Section title="6. Verificación de empresas">
          iUNI verifica manualmente las empresas registradas. Una empresa con badge de
          verificación ha sido revisada por nuestro equipo. Sin embargo, iUNI no se hace
          responsable por el contenido de las ofertas publicadas ni por las decisiones
          de contratacion de las empresas.
        </Section>

        <Section title="7. Propiedad intelectual">
          El contenido, diseno y codigo de iUNI son propiedad de sus creadores. Los
          usuarios conservan la propiedad de los contenidos que suben a la plataforma.
        </Section>

        <Section title="8. Limitacion de responsabilidad">
          iUNI es un intermediario entre estudiantes y empresas. No garantizamos la
          obtencion de empleo ni la calidad de los candidatos. No somos responsables
          por acuerdos alcanzados fuera de la plataforma.
        </Section>

        <Section title="9. Contacto">
          Para preguntas sobre estos terminos o tu privacidad puedes contactarnos
          respondiendo cualquier email que recibas de iUNI o escribiendo a nuestro
          correo de soporte.
        </Section>

        <div className="mt-10 p-6 bg-gray-950 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-sm text-center">
            Al usar iUNI aceptas estos terminos. Si no estas de acuerdo con alguno
            de ellos, por favor no uses la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-black mb-3 text-white">{title}</h2>
      <p className="text-gray-400 leading-relaxed text-sm">{children}</p>
    </div>
  );
}
