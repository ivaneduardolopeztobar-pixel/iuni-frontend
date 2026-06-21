import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import api from "../api/client";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const token = params.get("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  const validate = () => {
    if (password.length < 8) return "Al menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe tener al menos una mayuscula";
    if (!/[0-9]/.test(password)) return "Debe tener al menos un numero";
    if (password !== confirm) return "Las contraseñas no coinciden";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/reset/confirm", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error al restablecer");
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
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Contraseña actualizada</h2>
              <p className="text-gray-400 text-sm">Redirigiendo al login...</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Nueva contraseña</h2>
              <p className="text-gray-400 text-sm mb-6">Ingresa tu nueva contraseña.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Nueva contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="Minimo 8 caracteres"
                    required
                  />
                  {password && (
                    <div className="mt-2 space-y-1">
                      <Rule ok={password.length >= 8} text="Al menos 8 caracteres" />
                      <Rule ok={/[A-Z]/.test(password)} text="Al menos una mayuscula" />
                      <Rule ok={/[0-9]/.test(password)} text="Al menos un numero" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="Repite la contraseña"
                    required
                  />
                  {confirm && password !== confirm && (
                    <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                  )}
                  {confirm && password === confirm && confirm.length > 0 && (
                    <p className="text-green-400 text-xs mt-1">Las contraseñas coinciden</p>
                  )}
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
                  {loading ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Rule({ ok, text }) {
  return (
    <div className={"flex items-center gap-1.5 text-xs " + (ok ? "text-green-400" : "text-gray-600")}>
      <div className={"w-1.5 h-1.5 rounded-full " + (ok ? "bg-green-400" : "bg-gray-700")} />
      {text}
    </div>
  );
}
