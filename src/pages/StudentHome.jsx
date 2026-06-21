import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Heart, Search, Clock, SlidersHorizontal, X, ChevronLeft, ChevronRight, ShieldCheck, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import ApplyModal from "../components/ApplyModal";
import ProfileCompletionBar from "../components/ProfileCompletionBar";
import SEO from "../components/SEO";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const JOB_TYPES = ["Todos", "Tiempo completo", "Medio tiempo", "Pasantia", "Por proyecto", "Freelance"];
const LIMIT = 10;
const BASE = "http://localhost:3001";

export default function StudentHome() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [serverError, setServerError] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const saveSearchHistory = (term) => {
    if (!term || term.trim().length < 2) return;
    const key = "iuni_search_history";
    let history = JSON.parse(localStorage.getItem(key) || "[]");
    history = history.filter(h => h.toLowerCase() !== term.toLowerCase());
    history.unshift(term);
    history = history.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(history));
  };

  const getSearchHistory = () => {
    return JSON.parse(localStorage.getItem("iuni_search_history") || "[]");
  };

  const [searchHistory, setSearchHistory] = useState(getSearchHistory());
  const [showHistory, setShowHistory] = useState(false);

  const fetchJobs = async (p = 1, s = search, l = location, jt = jobType) => {
    setLoading(true);
    setServerError(false);
    try {
      const params = new URLSearchParams();
      if (s) params.append("search", s);
      if (l) params.append("location", l);
      if (jt && jt !== "Todos") params.append("jobType", jt);
      params.append("page", p);
      params.append("limit", LIMIT);
      const { data } = await api.get("/jobs?" + params.toString());
      setJobs(data.jobs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (e) {
      console.error(e);
      setJobs([]);
      setTotal(0);
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchJobs(1);
    api.get("/student/profile").then(r => {
      setProfile(r.data);
      const done = localStorage.getItem("onboardingDone_" + user?.userId);
      if (!done) {
        const incomplete = !r.data.firstName || !r.data.career || !r.data.desiredPosition;
        if (incomplete) navigate("/onboarding");
      }
    }).catch(() => {});
    api.get("/favorites/my").then(r => {
      setFavoritedIds(new Set(r.data.map(f => f.jobPostId)));
    }).catch(() => {});
  }, []);

  // Debounce en busqueda de texto
  const handleSearchChange = (val, field) => {
    if (field === "search") setSearch(val);
    if (field === "location") setLocation(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const s = field === "search" ? val : search;
      const l = field === "location" ? val : location;
      fetchJobs(1, s, l, jobType);
    }, 500);
  };

  const handleJobTypeChange = (jt) => {
    setJobType(jt);
    fetchJobs(1, search, location, jt);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("Todos");
    fetchJobs(1, "", "", "Todos");
  };

  const shareJob = (e, job) => {
    e.stopPropagation();
    const url = window.location.origin + "/jobs/" + job.id;
    const text = "Mira esta oferta en iUNI: " + job.title + " en " + (job.employer?.companyName || "") + ". Aplica aqui: " + url;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  const handleFavorite = async (e, jobId) => {
    e.stopPropagation();
    try {
      const { data } = await api.post("/favorites/" + jobId + "/toggle");
      setFavoritedIds(prev => {
        const next = new Set(prev);
        if (data.favorited) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
    } catch {}
  };

  const handleApply = (e, job) => {
    e.stopPropagation();
    setApplyModal(job);
  };

  const goToPage = (p) => {
    fetchJobs(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = search || location || (jobType && jobType !== "Todos");

  return (
    <div className="min-h-screen bg-black text-white">
      {applyModal && (
        <ApplyModal
          jobId={applyModal.id}
          jobTitle={applyModal.title}
          onClose={() => setApplyModal(null)}
          onSuccess={() => { setApplyModal(null); alert("Postulacion enviada exitosamente!"); }}
        />
      )}
      <SEO title="Buscar empleos" description="Encuentra cientos de empleos para estudiantes universitarios en El Salvador." />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">

        {profile && <ProfileCompletionBar profile={profile} />}

        {/* Busqueda */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex-1 hover:border-white/20 focus-within:border-red-600/50 transition-all">
            <MapPin size={16} className="text-gray-600 shrink-0" />
            <input
              className="bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none flex-1 w-full"
              placeholder="Ciudad o departamento"
              value={location}
              onChange={e => handleSearchChange(e.target.value, "location")}
            />
            {location && (
              <button onClick={() => { setLocation(""); fetchJobs(1, search, "", jobType); }}>
                <X size={14} className="text-gray-600 hover:text-white transition" />
              </button>
            )}
          </div>
          <div className="relative flex-1">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 focus-within:border-red-600/50 transition-all">
              <Briefcase size={16} className="text-gray-600 shrink-0" />
              <input
                className="bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none flex-1 w-full"
                placeholder="Puesto/Cargo/Categoria"
                value={search}
                onChange={e => handleSearchChange(e.target.value, "search")}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 150)}
                onKeyDown={e => { if (e.key === "Enter") { saveSearchHistory(search); setSearchHistory(getSearchHistory()); } }}
              />
              {search && (
                <button onClick={() => { setSearch(""); fetchJobs(1, "", location, jobType); }}>
                  <X size={14} className="text-gray-600 hover:text-white transition" />
                </button>
              )}
            </div>
            {showHistory && searchHistory.length > 0 && !search && (
              <div className="absolute left-0 top-full mt-1 w-full bg-gray-950 border border-gray-800 rounded-xl shadow-2xl z-30 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-900">
                  <p className="text-gray-600 text-xs font-bold">Busquedas recientes</p>
                </div>
                {searchHistory.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => { setSearch(term); setShowHistory(false); fetchJobs(1, term, location, jobType); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-900 hover:text-white transition flex items-center gap-2"
                  >
                    <Clock size={12} className="text-gray-600 shrink-0" /> {term}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => { saveSearchHistory(search); setSearchHistory(getSearchHistory()); fetchJobs(1); }}
            className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm w-full md:w-auto shadow-lg shadow-red-600/20"
          >
            <Search size={16} /> Buscar
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={"px-4 py-3 rounded-xl border transition flex items-center justify-center gap-2 text-sm w-full md:w-auto " +
              (showFilters || hasFilters ? "border-red-600 text-red-500 bg-red-950" : "border-gray-700 text-gray-400 hover:text-white")}
          >
            <SlidersHorizontal size={16} /> Filtros
            {hasFilters && <span className="bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>}
          </button>
        </div>

        {/* Panel filtros */}
        {showFilters && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Filtros</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition">
                  <X size={12} /> Limpiar
                </button>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Tipo de empleo</label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => handleJobTypeChange(t)}
                    className={"px-3 py-1.5 rounded-lg text-xs font-medium transition border " +
                      (jobType === t ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20" : "border-white/10 text-gray-400 hover:text-white hover:border-white/30")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contador y estado */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-sm">
              {loading ? "Buscando..." : total + " empleo" + (total !== 1 ? "s" : "") + " disponible" + (total !== 1 ? "s" : "")}
            </p>
            {loading && (
              <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          {!loading && totalPages > 1 && (
            <p className="text-xs text-gray-600">Pagina {page} de {totalPages}</p>
          )}
        </div>

        {/* Lista de empleos */}
        {!loading && serverError ? (
          <div className="text-center py-20 text-gray-600">
            <div className="w-16 h-16 bg-gray-950 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="font-bold text-gray-400 mb-2">No se pudo conectar al servidor</p>
            <p className="text-sm mb-4">Verifica tu conexion a internet</p>
            <button onClick={() => fetchJobs(1)} className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition">
              Reintentar
            </button>
          </div>
        ) : !loading && jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p>No se encontraron empleos</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 text-red-500 hover:text-red-400 text-sm transition">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {(loading ? Array(3).fill(null) : jobs).map((job, idx) => (
                job === null ? (
                  <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse h-28" />
                ) : (
                  <div
                    key={job.id}
                    onClick={() => navigate("/jobs/" + job.id)}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-red-600/40 hover:bg-white/[0.05] cursor-pointer transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-red-600 flex items-center justify-center">
                        {job.employer && job.employer.photoPath ? (
                          <img src={job.employer.photoPath} alt="logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-black text-sm">
                            {job.employer && job.employer.companyName && job.employer.companyName[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base group-hover:text-red-500 transition truncate">{job.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <button
                          onClick={e => { e.stopPropagation(); job.employer?.id && navigate("/employer/view/" + job.employer.id); }}
                          className="text-red-500 text-sm font-medium hover:text-red-400 hover:underline transition text-left"
                        >
                          {job.employer && job.employer.companyName}
                        </button>
                          {job.employer && job.employer.verified && (
                            <ShieldCheck size={14} className="text-green-400" title="Empresa verificada" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-gray-500 text-xs">
                          {job.employer && job.employer.city && (
                            <span className="flex items-center gap-1"><MapPin size={11} />{job.employer.city}</span>
                          )}
                          {job.jobType && (
                            <span className="bg-gray-900 px-2 py-0.5 rounded-full border border-gray-800">{job.jobType}</span>
                          )}
                          {job.salary && <span className="text-green-400 font-semibold">{job.salary}</span>}
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {Math.floor((Date.now() - new Date(job.createdAt)) / 86400000)}d atras
                          </span>
                        </div>
                        {job.description && (
                          <p className="text-gray-600 text-xs mt-2 line-clamp-1">{job.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={e => handleFavorite(e, job.id)} className="p-2 hover:bg-gray-800 rounded-lg transition">
                          <Heart
                            size={16}
                            className={favoritedIds.has(job.id) ? "text-red-500 fill-red-500 transition-colors" : "text-gray-600 hover:text-red-500 transition-colors"}
                          />
                        </button>
                        <button onClick={e => shareJob(e, job)} className="p-2 hover:bg-gray-800 rounded-lg transition" title="Compartir por WhatsApp">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-gray-600 hover:text-green-500 transition group-hover:text-green-500">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </button>
                        <button
                          onClick={e => handleApply(e, job)}
                          disabled={applying === job.id}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                          {applying === job.id ? "..." : "Aplicar"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Paginacion */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => p === "..." ? (
                    <span key={"dots" + i} className="text-gray-600 px-1">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={"w-9 h-9 rounded-xl text-sm font-bold transition border " +
                        (p === page ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20" : "border-white/10 text-gray-400 hover:text-white hover:border-white/30")}
                    >
                      {p}
                    </button>
                  ))
                }

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
