import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Eye, Printer } from 'lucide-react';
import Navbar from '../components/Navbar';
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0 justify-between mb-6">
          <h1 className="text-2xl font-black">Mis Publicaciones</h1>
          <Link
            to="/employer/post-job"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
          >
            <PlusCircle size={16} /> Nueva oferta
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2].map(i => <div key={i} className="bg-gray-950 rounded-xl h-24 animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">No tienes publicaciones aún</p>
            <Link to="/employer/post-job" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition">
              Crear primera oferta
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">{post.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Publicado: {new Date(post.createdAt).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {post.applications?.length || 0} postulaciones recibidas
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0 md:ml-auto">
                    <IconBtn icon={<Edit2 size={16}/>} title="Editar" onClick={() => navigate("/employer/edit-job/" + post.id)} />
                    <IconBtn icon={<Printer size={16}/>} title="Imprimir" />
                    <IconBtn
                      icon={<Trash2 size={16}/>}
                      title="Eliminar"
                      onClick={() => handleDelete(post.id)}
                      danger
                    />
                    <IconBtn
                      icon={<Eye size={16}/>}
                      title="Ver postulantes"
                      color="green"
                      onClick={() => navigate(`/employer/applicants/${post.id}`)}
                    />
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
    ? 'text-gray-500 hover:text-red-500 hover:bg-gray-900'
    : color === 'green'
    ? 'text-gray-500 hover:text-green-400 hover:bg-gray-900'
    : 'text-gray-500 hover:text-white hover:bg-gray-900';
  return (
    <button title={title} onClick={onClick} className={`p-2 rounded-lg transition ${cls}`}>
      {icon}
    </button>
  );
}
