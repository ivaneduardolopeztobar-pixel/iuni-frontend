import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, FileText, Bell, TrendingUp, Trash2, Eye, EyeOff, Search, LogOut, ShieldCheck, ShieldOff, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [domainRequests, setDomainRequests] = useState([]);
  const [newDomain, setNewDomain] = useState({ domain: '', university: '' });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { if (tab === "users") loadUsers(); }, [tab, userType]);
  useEffect(() => { if (tab === "jobs") loadJobs(); }, [tab]);
  useEffect(() => { if (tab === "employers") loadEmployers(); }, [tab]);
  useEffect(() => { if (tab === "domains") { loadDomains(); loadDomainRequests(); } }, [tab]);

  const loadStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch { navigate("/login"); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userType) params.append("type", userType);
      if (search) params.append("search", search);
      const { data } = await api.get("/admin/users?" + params.toString());
      setUsers(data.users);
    } finally { setLoading(false); }
  };

  const loadEmployers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/employers");
      setEmployers(data);
    } finally { setLoading(false); }
  };

  const handleToggleVerify = async (id) => {
    try {
      const { data } = await api.patch("/admin/employers/" + id + "/verify");
      setEmployers(prev => prev.map(e => e.id === id ? { ...e, verified: data.verified } : e));
    } catch { alert("Error"); }
  };

  const loadDomains = async () => {
    try {
      const { data } = await api.get("/admin/domains");
      setDomains(data);
    } catch {}
  };

  const loadDomainRequests = async () => {
    try {
      const { data } = await api.get("/admin/domain-requests");
      setDomainRequests(data);
    } catch {}
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/domains", newDomain);
      setDomains(prev => [...prev, data]);
      setNewDomain({ domain: "", university: "" });
    } catch (err) { alert(err.response?.data?.error || "Error"); }
  };

  const handleToggleDomain = async (id) => {
    try {
      const { data } = await api.patch("/admin/domains/" + id + "/toggle");
      setDomains(prev => prev.map(d => d.id === id ? data : d));
    } catch { alert("Error"); }
  };

  const handleApproveRequest = async (id) => {
    try {
      await api.post("/admin/domain-requests/" + id + "/approve");
      setDomainRequests(prev => prev.filter(r => r.id !== id));
      loadDomains();
    } catch { alert("Error"); }
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/jobs");
      setJobs(data.jobs);
    } finally { setLoading(false); }
  };

  const handleDeleteUser = async (id, email) => {
    if (!confirm("Eliminar usuario " + email + "?")) return;
    try {
      await api.delete("/admin/users/" + id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) { alert(err.response?.data?.error || "Error"); }
  };

  const handleToggleJob = async (id) => {
    try {
      const { data } = await api.patch("/admin/jobs/" + id + "/toggle");
      setJobs(prev => prev.map(j => j.id === id ? { ...j, isActive: data.isActive } : j));
    } catch { alert("Error"); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading && !stats) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-500">Cargando panel...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar admin */}
      <nav className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black"><span className="text-red-600">i</span>UNI</h1>
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
          <LogOut size={16} /> Cerrar sesion
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-0">
          {[
            { id: "stats", label: "Estadisticas", icon: <TrendingUp size={16}/> },
            { id: "users", label: "Usuarios", icon: <Users size={16}/> },
            { id: "jobs", label: "Empleos", icon: <Briefcase size={16}/> },
            { id: "employers", label: "Empresas", icon: <Building2 size={16}/> },
            { id: "domains", label: "Universidades", icon: <FileText size={16}/> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={"flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition " +
                (tab === t.id ? "border-red-600 text-white" : "border-transparent text-gray-500 hover:text-gray-300")}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* STATS */}
        {tab === "stats" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users size={24}/>} label="Estudiantes" value={stats.stats.totalStudents} color="blue" />
              <StatCard icon={<Briefcase size={24}/>} label="Empleadores" value={stats.stats.totalEmployers} color="purple" />
              <StatCard icon={<FileText size={24}/>} label="Empleos activos" value={stats.stats.totalJobs} color="green" />
              <StatCard icon={<TrendingUp size={24}/>} label="Postulaciones" value={stats.stats.totalApplications} color="red" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Usuarios recientes */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={16} className="text-red-500"/> Usuarios recientes</h3>
                <div className="space-y-3">
                  {stats.recentUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{u.email}</p>
                        <p className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString("es-SV")}</p>
                      </div>
                      <span className={"text-xs font-bold px-2 py-0.5 rounded-full " +
                        (u.userType === "STUDENT" ? "bg-blue-950 text-blue-400" : "bg-purple-950 text-purple-400")}>
                        {u.userType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empleos recientes */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={16} className="text-red-500"/> Empleos recientes</h3>
                <div className="space-y-3">
                  {stats.recentJobs.map(j => (
                    <div key={j.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium truncate max-w-48">{j.title}</p>
                        <p className="text-xs text-gray-500">{j.employer?.companyName}</p>
                      </div>
                      <span className="text-xs text-gray-400">{j._count?.applications} apps</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Postulaciones por estado */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Postulaciones por estado</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.applicationsByStatus.map(s => (
                  <div key={s.status} className="text-center">
                    <p className="text-2xl font-black text-red-500">{s._count.status}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {tab === "users" && (
          <div>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 flex-1">
                <Search size={16} className="text-gray-600" />
                <input
                  className="bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none flex-1"
                  placeholder="Buscar por email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && loadUsers()}
                />
              </div>
              <select
                value={userType}
                onChange={e => setUserType(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="STUDENT">Estudiantes</option>
                <option value="EMPLOYER">Empleadores</option>
              </select>
              <button onClick={loadUsers} className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
                Buscar
              </button>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuario</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Nombre</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Tipo</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Registro</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-900 hover:bg-gray-900 transition">
                      <td className="px-4 py-3 text-gray-300 truncate max-w-48">{u.email}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                        {u.student ? u.student.firstName + " " + u.student.lastName : u.employer?.companyName || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={"text-xs font-bold px-2 py-0.5 rounded-full " +
                          (u.userType === "STUDENT" ? "bg-blue-950 text-blue-400" : "bg-purple-950 text-purple-400")}>
                          {u.userType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                        {new Date(u.createdAt).toLocaleDateString("es-SV")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="p-1.5 hover:bg-gray-800 rounded-lg transition text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-600">No se encontraron usuarios</div>
              )}
            </div>
          </div>
        )}

        {/* EMPRESAS */}
        {tab === "employers" && (
          <div>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Empresa</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Empleos</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Verificar</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map(e => (
                    <tr key={e.id} className="border-b border-gray-900 hover:bg-gray-900 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-xs font-black shrink-0">
                            {e.companyName && e.companyName[0]}
                          </div>
                          <div>
                            <p className="font-medium">{e.companyName}</p>
                            <p className="text-xs text-gray-500">{e.sector || "Sin sector"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{e.user?.email}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{e._count?.jobPosts}</td>
                      <td className="px-4 py-3">
                        {e.verified ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-400">
                            <ShieldCheck size={14}/> Verificada
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">Sin verificar</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleVerify(e.id)}
                          className={"p-1.5 rounded-lg transition " + (e.verified ? "text-green-500 hover:bg-gray-800" : "text-gray-500 hover:text-green-400 hover:bg-gray-800")}
                          title={e.verified ? "Quitar verificacion" : "Verificar empresa"}
                        >
                          {e.verified ? <ShieldCheck size={16}/> : <ShieldOff size={16}/>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employers.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-600">No hay empresas</div>
              )}
            </div>
          </div>
        )}

        {/* DOMINIOS */}
        {tab === "domains" && (
          <div className="space-y-6">
            {/* Solicitudes pendientes */}
            {domainRequests.length > 0 && (
              <div className="bg-yellow-950 border border-yellow-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-yellow-400">Solicitudes pendientes ({domainRequests.length})</h3>
                <div className="space-y-3">
                  {domainRequests.map(r => (
                    <div key={r.id} className="flex items-center justify-between bg-gray-950 rounded-xl p-4">
                      <div>
                        <p className="font-bold text-sm">@{r.domain}</p>
                        <p className="text-gray-400 text-xs">{r.university}</p>
                        <p className="text-gray-600 text-xs">{r.email}</p>
                      </div>
                      <button onClick={() => handleApproveRequest(r.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                        Aprobar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agregar dominio */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Agregar universidad</h3>
              <form onSubmit={handleAddDomain} className="flex gap-3 flex-wrap">
                <input value={newDomain.domain} onChange={e => setNewDomain({...newDomain, domain: e.target.value})}
                  placeholder="dominio.edu.sv" required
                  className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 flex-1 min-w-48" />
                <input value={newDomain.university} onChange={e => setNewDomain({...newDomain, university: e.target.value})}
                  placeholder="Nombre de la universidad" required
                  className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 flex-1 min-w-48" />
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
                  Agregar
                </button>
              </form>
            </div>

            {/* Lista de dominios */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Dominio</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Universidad</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map(d => (
                    <tr key={d.id} className="border-b border-gray-900 hover:bg-gray-900 transition">
                      <td className="px-4 py-3 font-mono text-red-400 text-sm">@{d.domain}</td>
                      <td className="px-4 py-3 text-gray-300">{d.university}</td>
                      <td className="px-4 py-3">
                        <span className={"text-xs font-bold px-2 py-0.5 rounded-full " + (d.active ? "bg-green-950 text-green-400" : "bg-gray-900 text-gray-500")}>
                          {d.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleToggleDomain(d.id)}
                          className={"p-1.5 rounded-lg transition " + (d.active ? "text-green-500 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-800")}>
                          {d.active ? <Eye size={15}/> : <EyeOff size={15}/>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPLEOS */}
        {tab === "jobs" && (
          <div>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Empleo</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Empresa</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Apps</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id} className="border-b border-gray-900 hover:bg-gray-900 transition">
                      <td className="px-4 py-3 font-medium truncate max-w-48">{j.title}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{j.employer?.companyName}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{j._count?.applications}</td>
                      <td className="px-4 py-3">
                        <span className={"text-xs font-bold px-2 py-0.5 rounded-full " +
                          (j.isActive ? "bg-green-950 text-green-400" : "bg-gray-900 text-gray-500")}>
                          {j.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleJob(j.id)}
                          className="p-1.5 hover:bg-gray-800 rounded-lg transition text-gray-500 hover:text-white"
                          title={j.isActive ? "Desactivar" : "Activar"}
                        >
                          {j.isActive ? <EyeOff size={15}/> : <Eye size={15}/>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-600">No hay empleos</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-950 border-blue-900 text-blue-400",
    purple: "bg-purple-950 border-purple-900 text-purple-400",
    green: "bg-green-950 border-green-900 text-green-400",
    red: "bg-red-950 border-red-900 text-red-400",
  };
  return (
    <div className={"rounded-2xl border p-5 " + colors[color]}>
      <div className="mb-3 opacity-80">{icon}</div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-xs mt-1 opacity-70">{label}</p>
    </div>
  );
}
