import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import api from '../api/client';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      if (data.userType === 'ADMIN') navigate('/admin');
      else if (data.userType === 'STUDENT') navigate('/home');
      else navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <SEO title="Iniciar sesion" description="Inicia sesion en iUNI" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-white">
            <span className="text-red-600">i</span>UNI
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Plataforma de empleo estudiantil</p>
        </div>

        <div className="bg-white/[0.03] rounded-2xl p-8 shadow-2xl shadow-black/40 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all"
                placeholder="••••••••"
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
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 hover:-translate-y-0.5"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          <Link to="/forgot-password" className="block text-center text-gray-500 text-sm mt-5 hover:text-gray-300 transition-colors">
            Olvidé mi contraseña
          </Link>
          <p className="text-center text-gray-500 text-sm mt-3">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
