import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Eye, Briefcase, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import api from '../api/client';

export default function EmployerDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/my-posts').then(r => setPosts(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta publicación?')) return;
    await api.delete(`/jobs/${id}`);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const totalApplications = posts.reduce((sum, p) => sum + (p.applications?.length || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Mis publicaciones" description="Gestiona tus ofertas de empleo en iUNI" />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0 justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-black">Mis publicaciones</h1>
            {!loading && posts.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {posts.length} oferta{posts.length !== 1 ? "s" : ""} · {totalApplications} postulacion{totalApplications !== 1 ? "es" : ""} en total
              </p>
            )}
          </div>
          <Link
            to="/employer/post-job"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-red-600/20"
          >
            <PlusCircle size={16} /> Nueva oferta
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map(i => <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-fade-in">
            <Briefcase size={40} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500 mb-6">No tienes publicaciones aun</p>
            <Link to="/employer/post-job" className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 inline-block">
              Crear primera oferta
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all animate-slide-up"
                style={{ animationDelay: i * 40 + "ms" }}
              >
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base truncate">{post.title}</h3>
                      <span className={"text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 " +
                        (post.isActive !== false
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-white/5 text-gray-500 border-white/10")}>
                        {post.isActive !== false ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5">
                      Publicado: {new Date(post.createdAt).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-red-500 text-sm mt-1.5 font-semibold flex items-center gap-1.5">
                      <TrendingUp size={13} />
                      {post.applications?.length || 0} postulacion{(post.applications?.length || 0) !== 1 ? "es" : ""} recibida{(post.applications?.length || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0 md:ml-auto">
                    <IconBtn icon={<Eye size={16} />} title="Ver postulantes" color="green" onClick={() => navigate(`/employer/applicants/${post.id}`)} />
                    <IconBtn icon={<Edit2 size={16} />} title="Editar" onClick={() => navigate("/employer/edit-job/" + post.id)} />
                    <IconBtn icon={<Trash2 size={16} />} title="Eliminar" onClick={() => handleDelete(post.id)} danger />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ icon, title, onClick, danger, color }) {
  const cls = danger
    ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
    : color === 'green'
    ? 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'
    : 'text-gray-500 hover:text-white hover:bg-white/10';
  return (
    <button title={title} onClick={onClick} className={`p-2.5 rounded-xl transition-all ${cls}`}>
      {icon}
    </button>
  );
}
