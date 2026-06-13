import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-white">
            <span className="text-red-600">i</span>UNI
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Plataforma de empleo estudiantil</p>
        </div>

        <div className="bg-gray-950 rounded-2xl p-8 shadow-2xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
                placeholder="••••••••"
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <Link to="/forgot-password" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-300 transition">
            Olvidé mi contraseña
          </Link>
          <p className="text-center text-gray-500 text-sm mt-3">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold transition">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
