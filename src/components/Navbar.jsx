import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, BellRing, ChevronDown, LogOut, FileText, Briefcase, Heart, User, Eye, X, CheckCheck, Menu, TrendingUp } from "lucide-react";
import api from "../api/client";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setUnread(data.filter(n => !n.read).length);
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch {}
  };

  const handleMarkOne = async (id) => {
    try {
      await api.put("/notifications/" + id + "/read");
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (days > 0) return days + "d";
    if (hours > 0) return hours + "h";
    return minutes + "m";
  };

  const closeAll = () => {
    setMenuOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-black/90 backdrop-blur-lg text-white px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 border-b border-white/5">
        <Link to="/" className="text-2xl font-black tracking-tight select-none">
          <span className="text-red-600">i</span>UNI
        </Link>

        {/* Desktop employer links */}
        {user && user.userType === "EMPLOYER" && (
          <div className="hidden md:flex gap-6 mx-6">
            <Link to="/employer/dashboard" className="text-sm text-gray-300 hover:text-red-500 transition">Publicaciones</Link>
            <Link to="/employer/post-job" className="text-sm text-gray-300 hover:text-red-500 transition">Nueva oferta</Link>
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto">

          {/* Campana */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); setMobileMenuOpen(false); }} className="relative p-1">
              <Bell size={20} className={"transition " + (unread > 0 ? "text-red-500" : "text-gray-400 hover:text-white")} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-72 md:w-80 z-50 animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <h3 className="font-bold text-sm">Notificaciones</h3>
                  <div className="flex gap-2">
                    {unread > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition">
                        <CheckCheck size={12} /> Leer todas
                      </button>
                    )}
                    <button onClick={() => setNotifOpen(false)}>
                      <X size={14} className="text-gray-500 hover:text-white transition" />
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 text-sm">Sin notificaciones</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => handleMarkOne(n.id)}
                        className={"flex gap-3 px-4 py-3 border-b border-gray-900 cursor-pointer hover:bg-gray-900 transition " + (!n.read ? "bg-gray-900" : "")}>
                        <div className={"w-2 h-2 rounded-full mt-1.5 shrink-0 " + (!n.read ? "bg-red-500" : "bg-transparent")} />
                        <div className="flex-1 min-w-0">
                          <p className={"text-xs font-bold " + (!n.read ? "text-white" : "text-gray-400")}>{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                        <span className="text-gray-600 text-xs shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop user menu */}
          <div className="relative hidden md:block">
            <button onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }} className="flex items-center gap-2 hover:text-red-500 transition">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-red-600/50 transition-all shrink-0">
                {user && user.photoPath ? (
                  <img src={user.photoPath} alt="foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-red-600 flex items-center justify-center text-xs font-black">
                    {user && user.userType === "STUDENT" ? "S" : "E"}
                  </div>
                )}
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-52 py-2 z-50 animate-slide-up overflow-hidden">
                {user && user.userType === "STUDENT" ? (
                  <>
                    <MenuItem to="/student/profile" icon={<FileText size={14}/>} label="Mi CV" close={closeAll} />
                    <MenuItem to="/my-applications" icon={<Briefcase size={14}/>} label="Mis postulaciones" close={closeAll} />
                    <MenuItem to="/my-favorites" icon={<Heart size={14}/>} label="Mis favoritos" close={closeAll} />
                    <MenuItem to="/profile-views" icon={<Eye size={14}/>} label="Quien vio mi perfil" close={closeAll} />
                  <MenuItem to="/job-alerts" icon={<BellRing size={14}/>} label="Alertas de empleo" close={closeAll} />
                  </>
                ) : (
                  <>
                    <MenuItem to="/employer/dashboard" icon={<Briefcase size={14}/>} label="Mis publicaciones" close={closeAll} />
                    <MenuItem to="/employer/post-job" icon={<FileText size={14}/>} label="Nueva oferta" close={closeAll} />
                    <MenuItem to="/employer/profile" icon={<User size={14}/>} label="Perfil empresa" close={closeAll} />
                  <MenuItem to="/employer/metrics" icon={<TrendingUp size={14}/>} label="Metricas" close={closeAll} />
                  </>
                )}
                <hr className="border-gray-800 my-1" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-900 transition">
                  <LogOut size={14} /> Cerrar sesion
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setNotifOpen(false); setMenuOpen(false); }}
            className="md:hidden p-1 text-gray-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={closeAll}>
          <div className="absolute right-0 top-0 h-full w-72 bg-[#0a0a0a] border-l border-white/10 p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black"><span className="text-red-600">i</span>UNI</h2>
              <button onClick={closeAll}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="space-y-1">
              {user && user.userType === "STUDENT" ? (
                <>
                  <MobileItem to="/home" label="Buscar empleos" icon={<Briefcase size={16}/>} close={closeAll} />
                  <MobileItem to="/student/profile" label="Mi CV" icon={<FileText size={16}/>} close={closeAll} />
                  <MobileItem to="/my-applications" label="Mis postulaciones" icon={<Briefcase size={16}/>} close={closeAll} />
                  <MobileItem to="/my-favorites" label="Mis favoritos" icon={<Heart size={16}/>} close={closeAll} />
                  <MobileItem to="/profile-views" label="Quien vio mi perfil" icon={<Eye size={16}/>} close={closeAll} />
                </>
              ) : (
                <>
                  <MobileItem to="/employer/dashboard" label="Mis publicaciones" icon={<Briefcase size={16}/>} close={closeAll} />
                  <MobileItem to="/employer/post-job" label="Nueva oferta" icon={<FileText size={16}/>} close={closeAll} />
                  <MobileItem to="/employer/profile" label="Perfil empresa" icon={<User size={16}/>} close={closeAll} />
                </>
              )}
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">
                <LogOut size={16} /> Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({ to, icon, label, close }) {
  return (
    <Link to={to} onClick={close} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
      {icon} {label}
    </Link>
  );
}

function MobileItem({ to, icon, label, close }) {
  return (
    <Link to={to} onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
      <span className="text-red-500">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
