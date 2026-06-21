import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import SEO from "../components/SEO";
import api from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/reset/request", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error al enviar correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Recuperar contraseña" description="Restablece tu contraseña en iUNI" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white">
            <span className="text-red-600">i</span>UNI
          </h1>
        </div>
        <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40">
          {sent ? (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Correo enviado</h2>
              <p className="text-gray-400 text-sm mb-6">
                Si el email esta registrado recibiras un enlace para restablecer tu contraseña.
                Revisa tu bandeja de entrada y spam.
              </p>
              <Link to="/login" className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors">
                Volver al login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft size={14} /> Volver al login
              </Link>
              <h2 className="text-xl font-bold mb-2 text-white">Olvidaste tu contraseña?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Correo electronico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-slide-up">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-600/20 hover:-translate-y-0.5"
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
