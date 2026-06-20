import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Mail, AlertTriangle, GraduationCap, Briefcase } from "lucide-react";
import api from "../api/client";

export default function Register() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", companyName: "", repName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [domainRequest, setDomainRequest] = useState(null);
  const [requestForm, setRequestForm] = useState({ university: "" });
  const [requestSent, setRequestSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "La contrasena debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(pwd)) return "Debe contener al menos una mayuscula";
    if (!/[0-9]/.test(pwd)) return "Debe contener al menos un numero";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(form.password);
    if (pwdError) { setError(pwdError); return; }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", { ...form, userType });
      if (data.requiresVerification) {
        setVerificationSent(true);
      } else {
        login(data);
        navigate(userType === "STUDENT" ? "/home" : "/employer/dashboard");
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.canRequest) {
        setDomainRequest({ domain: form.email.split("@")[1], email: form.email });
      } else {
        setError(errData?.error || "Error al registrar");
      }
    } finally { setLoading(false); }
  };

  const handleDomainRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/request-domain", {
        domain: domainRequest.domain,
        university: requestForm.university,
        email: domainRequest.email
      });
      setRequestSent(true);
    } catch { setError("Error al enviar solicitud"); }
    finally { setLoading(false); }
  };

  // Verificacion enviada
  if (verificationSent) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-black text-white mb-8"><span className="text-red-600">i</span>UNI</h1>
        <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40 animate-fade-in">
          <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Revisa tu correo institucional</h2>
          <p className="text-gray-400 text-sm mb-2">
            Enviamos un enlace de verificacion a:
          </p>
          <p className="text-white font-bold mb-4">{form.email}</p>
          <p className="text-gray-500 text-xs mb-6">
            Debes verificar tu correo antes de iniciar sesion.
            Revisa tambien tu carpeta de spam.
          </p>
          <button
            onClick={async () => {
              await api.post("/auth/resend-verification", { email: form.email });
              alert("Correo reenviado");
            }}
            className="text-red-500 hover:text-red-400 text-sm transition"
          >
            No lo recibiste? Reenviar correo
          </button>
          <div className="mt-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-400 text-sm transition">
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Solicitud de dominio
  if (domainRequest) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white"><span className="text-red-600">i</span>UNI</h1>
        </div>
        <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40 animate-fade-in">
          {requestSent ? (
            <div className="text-center">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Solicitud enviada</h2>
              <p className="text-gray-400 text-sm mb-6">
                Revisaremos tu solicitud y agregaremos tu universidad pronto.
                Te notificaremos al email que proporcionaste.
              </p>
              <Link to="/login" className="text-red-500 hover:text-red-400 text-sm">
                Volver al login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle size={24} className="text-yellow-500 shrink-0" />
                <div>
                  <h2 className="font-bold">Universidad no registrada</h2>
                  <p className="text-gray-500 text-sm">El dominio @{domainRequest.domain} no esta en nuestra lista</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Si tu universidad da correos con este dominio, puedes solicitar que la agreguemos.
                Un administrador lo revisara pronto.
              </p>
              <form onSubmit={handleDomainRequest} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Nombre de tu universidad *</label>
                  <input
                    value={requestForm.university}
                    onChange={e => setRequestForm({ university: e.target.value })}
                    placeholder="Ej: Universidad de El Salvador"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition text-sm"
                    required
                  />
                </div>
                <div className="bg-gray-900 rounded-xl p-3 text-xs text-gray-500">
                  Dominio solicitado: <span className="text-white font-bold">@{domainRequest.domain}</span>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-600/20 hover:-translate-y-0.5">
                  {loading ? "Enviando..." : "Solicitar agregar mi universidad"}
                </button>
              </form>
              <button onClick={() => setDomainRequest(null)} className="w-full text-gray-600 text-sm mt-3 hover:text-gray-400 transition">
                Volver al registro
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Paso 1: seleccion de tipo
  if (step === 1) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-lg text-center relative animate-fade-in">
        <h1 className="text-6xl font-black text-white mb-2"><span className="text-red-600">i</span>UNI</h1>
        <p className="text-gray-500 mb-14 text-sm">La red de empleo virtual para estudiantes</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight">
          Buscas empleo<br/>o talento?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { setUserType("STUDENT"); setStep(2); }}
            className="group bg-white/[0.03] border border-white/10 hover:border-red-600/50 hover:bg-white/[0.05] rounded-2xl p-6 transition-all text-left">
            <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-600/20 group-hover:-translate-y-0.5 transition-transform">
              <GraduationCap size={20} className="text-white" />
            </div>
            <p className="font-black text-white text-base mb-1">Soy estudiante</p>
            <p className="text-gray-500 text-xs">Busco mi primer empleo</p>
          </button>
          <button onClick={() => { setUserType("EMPLOYER"); setStep(2); }}
            className="group bg-white/[0.03] border border-white/10 hover:border-red-600/50 hover:bg-white/[0.05] rounded-2xl p-6 transition-all text-left">
            <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-600/20 group-hover:-translate-y-0.5 transition-transform">
              <Briefcase size={20} className="text-white" />
            </div>
            <p className="font-black text-white text-base mb-1">Soy empleador</p>
            <p className="text-gray-500 text-xs">Busco talento joven</p>
          </button>
        </div>
        {userType === "STUDENT" && (
          <p className="text-gray-600 text-xs mt-6">
            Requiere correo institucional universitario
          </p>
        )}
        <p className="text-gray-600 text-sm mt-6">
          Ya tienes cuenta?{" "}
          <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );

  // Paso 2: formulario
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white"><span className="text-red-600">i</span>UNI</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Crear cuenta — {userType === "STUDENT" ? "Estudiante" : "Empleador"}
          </p>
        </div>

        {userType === "STUDENT" && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-4 flex items-start gap-2 animate-slide-up">
            <Mail size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-300 text-xs leading-relaxed">
              Usa tu correo institucional universitario.
              Ejemplo: tu_nombre@ues.edu.sv, @utec.edu.sv, @uca.edu.sv, @udb.edu.sv, @unasa.edu.sv
            </p>
          </div>
        )}

        <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === "STUDENT" ? (
              <>
                <Field label="Nombre" value={form.firstName} onChange={v => setForm({...form, firstName: v})} />
                <Field label="Apellido" value={form.lastName} onChange={v => setForm({...form, lastName: v})} />
              </>
            ) : (
              <>
                <Field label="Nombre del representante" value={form.repName} onChange={v => setForm({...form, repName: v})} />
                <Field label="Nombre de la empresa" value={form.companyName} onChange={v => setForm({...form, companyName: v})} />
              </>
            )}
            <Field
              label={userType === "STUDENT" ? "Correo institucional" : "Correo electronico"}
              type="email"
              value={form.email}
              onChange={v => setForm({...form, email: v})}
              placeholder={userType === "STUDENT" ? "nombre@ues.edu.sv" : "correo@empresa.com"}
            />
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Contrasena</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
                required />
              {form.password && (
                <div className="mt-2 space-y-1">
                  <PasswordRule ok={form.password.length >= 8} text="Al menos 8 caracteres" />
                  <PasswordRule ok={/[A-Z]/.test(form.password)} text="Al menos una mayuscula" />
                  <PasswordRule ok={/[0-9]/.test(form.password)} text="Al menos un numero" />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-slide-up">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-600/20 hover:-translate-y-0.5">
              {loading ? "Creando cuenta..." : "Continuar"}
            </button>
          </form>
          <button onClick={() => setStep(1)} className="w-full text-gray-600 text-sm mt-4 hover:text-gray-400 transition">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
        required />
    </div>
  );
}

function PasswordRule({ ok, text }) {
  return (
    <div className={"flex items-center gap-1.5 text-xs " + (ok ? "text-green-400" : "text-gray-600")}>
      <div className={"w-1.5 h-1.5 rounded-full " + (ok ? "bg-green-400" : "bg-gray-700")} />
      {text}
    </div>
  );
}
