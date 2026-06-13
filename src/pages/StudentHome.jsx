import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Heart, Search, Clock, SlidersHorizontal, X, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import api from "../api/client";

const JOB_TYPES = ["Todos", "Tiempo completo", "Medio tiempo", "Pasantia", "Por proyecto", "Freelance"];
const LIMIT = 10;
const BASE = "http://localhost:3001";

export default function StudentHome() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [serverError, setServerError] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

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
  useEffect(() => { fetchJobs(1); }, []);

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

  const handleFavorite = async (e, jobId) => {
    e.stopPropagation();
    try { await api.post("/favorites/" + jobId + "/toggle"); } catch {}
  };

  const handleApply = async (e, jobId) => {
    e.stopPropagation();
    setApplying(jobId);
    try {
      await api.post("/applications/" + jobId + "/apply");
      alert("Postulacion enviada exitosamente!");
    } catch (err) {
      alert(err.response?.data?.error || "Error al postular");
    } finally { setApplying(null); }
  };

  const goToPage = (p) => {
    fetchJobs(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = search || location || (jobType && jobType !== "Todos");

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO title="Buscar empleos" description="Encuentra cientos de empleos para estudiantes universitarios en El Salvador." />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">

        {/* Busqueda */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 flex-1">
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
          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 flex-1">
            <Briefcase size={16} className="text-gray-600 shrink-0" />
            <input
              className="bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none flex-1 w-full"
              placeholder="Puesto/Cargo/Categoria"
              value={search}
              onChange={e => handleSearchChange(e.target.value, "search")}
            />
            {search && (
              <button onClick={() => { setSearch(""); fetchJobs(1, "", location, jobType); }}>
                <X size={14} className="text-gray-600 hover:text-white transition" />
              </button>
            )}
          </div>
          <button
            onClick={() => fetchJobs(1)}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm w-full md:w-auto"
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
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 mb-4">
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
                      (jobType === t ? "bg-red-600 border-red-600 text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500")}
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
                  <div key={idx} className="bg-gray-950 border border-gray-900 rounded-xl p-5 animate-pulse h-28" />
                ) : (
                  <div
                    key={job.id}
                    onClick={() => navigate("/jobs/" + job.id)}
                    className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-red-600 cursor-pointer transition group"
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
                          <p className="text-red-500 text-sm font-medium">{job.employer && job.employer.companyName}</p>
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
                          <Heart size={16} className="text-gray-600 hover:text-red-500 transition" />
                        </button>
                        <button
                          onClick={e => handleApply(e, job.id)}
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
                  className="p-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
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
                        (p === page ? "bg-red-600 border-red-600 text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500")}
                    >
                      {p}
                    </button>
                  ))
                }

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
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
