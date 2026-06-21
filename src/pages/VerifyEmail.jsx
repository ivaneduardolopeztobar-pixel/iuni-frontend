import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const token = params.get("token");

  useEffect(() => {
    if (!token) { setStatus("error"); setError("Token invalido"); return; }
    api.post("/auth/verify-email", { token })
      .then(r => {
        login(r.data);
        setStatus("success");
        // Redirigir al onboarding si es nuevo usuario
        setTimeout(() => navigate("/onboarding"), 2000);
      })
      .catch(err => {
        setStatus("error");
        setError(err.response?.data?.error || "Error al verificar");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-black text-white mb-8">
          <span className="text-red-600">i</span>UNI
        </h1>
        <div className="bg-gray-950 rounded-2xl p-8 border border-gray-800">
          {status === "loading" && (
            <>
              <Loader size={48} className="text-red-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold mb-2">Verificando tu correo...</h2>
              <p className="text-gray-500 text-sm">Un momento por favor</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Correo verificado</h2>
              <p className="text-gray-400 text-sm mb-2">Tu cuenta esta lista. Redirigiendo...</p>
              <div className="w-full bg-gray-900 rounded-full h-1 mt-4">
                <div className="bg-green-500 h-1 rounded-full animate-pulse w-full" />
              </div>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Error de verificación</h2>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
                Ir al login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
