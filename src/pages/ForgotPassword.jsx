import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white">
            <span className="text-red-600">i</span>UNI
          </h1>
        </div>

        <div className="bg-gray-950 rounded-2xl p-8 border border-gray-800">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Correo enviado</h2>
              <p className="text-gray-400 text-sm mb-6">
                Si el email esta registrado recibiras un enlace para restablecer tu contrasena.
                Revisa tu bandeja de entrada y spam.
              </p>
              <Link to="/login" className="text-red-500 hover:text-red-400 text-sm font-semibold transition">
                Volver al login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition">
                <ArrowLeft size={14} /> Volver al login
              </Link>
              <h2 className="text-xl font-bold mb-2">Olvidaste tu contrasena?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Correo electronico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
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
