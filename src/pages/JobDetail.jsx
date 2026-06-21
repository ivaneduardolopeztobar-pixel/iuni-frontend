import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, DollarSign, GraduationCap, Users, ShieldCheck, Share2, MessageCircle, Copy, CheckCircle, Heart } from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import ApplyModal from '../components/ApplyModal';
import api from '../api/client';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data)).catch(() => navigate('/home')).finally(() => setLoading(false));
    api.get('/favorites/my').then(r => {
      setFavorited(r.data.some(f => f.jobPostId === parseInt(id)));
    }).catch(() => {});
  }, [id]);

  const jobUrl = window.location.href;

  const shareWhatsApp = () => {
    const text = "Mira esta oferta de empleo en iUNI: " + (job?.title || "") + " en " + (job?.employer?.companyName || "") + ". Aplica aqui: " + jobUrl;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  const shareFacebook = () => {
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(jobUrl), "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = async () => {
    try {
      const { data } = await api.post(`/favorites/${id}/toggle`);
      setFavorited(data.favorited);
    } catch {}
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-gray-500">Cargando...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {showApplyModal && job && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            alert("Postulacion enviada exitosamente!");
          }}
        />
      )}
      <SEO
        title={job ? job.title + " en " + (job.employer?.companyName || "") : "Empleo"}
        description={job ? "Oferta de trabajo: " + job.title + " en " + (job.employer?.companyName || "") + (job.employer?.city ? ", " + job.employer.city : "") + ". " + (job.description ? job.description.substring(0, 120) : "") : ""}
      />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition text-sm">
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 animate-fade-in">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-red-600 flex items-center justify-center">
              {job && job.employer && job.employer.photoPath ? (
                <img src={job.employer.photoPath} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-xl">
                  {job && job.employer && job.employer.companyName && job.employer.companyName[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black">{job?.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => job?.employer?.id && navigate("/employer/view/" + job.employer.id)}
                  className="text-red-500 font-semibold hover:text-red-400 transition hover:underline"
                >
                  {job?.employer?.companyName}
                </button>
                {job?.employer?.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} /> Verificada
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={toggleFavorite}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all shrink-0"
              title={favorited ? "Quitar de favoritos" : "Guardar como favorito"}
            >
              <Heart size={20} className={favorited ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500 transition-colors"} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {job?.employer?.city && <Tag icon={<MapPin size={13} />} label={job.employer.city} />}
            {job?.jobType && <Tag icon={<Briefcase size={13} />} label={job.jobType} />}
            {job?.salary && <Tag icon={<DollarSign size={13} />} label={job.salary} color="green" />}
            {job?.minEducation && <Tag icon={<GraduationCap size={13} />} label={job.minEducation} />}
          </div>

          <div className="space-y-5">
            <Section title="Descripción del puesto" content={job?.description} />
            {job?.experienceRequired && <Section title="Experiencia requerida" content={job.experienceRequired} />}
            {job?.technicalSkills && <Section title="Habilidades técnicas" content={job.technicalSkills} />}
            {job?.softSkills && <Section title="Habilidades blandas" content={job.softSkills} />}
            {job?.workConditions && <Section title="Condiciones laborales" content={job.workConditions} />}
            {job?.studentBenefits && <Section title="Beneficios estudiantiles" content={job.studentBenefits} />}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="relative mb-4">
              <button
                onClick={() => setShowShare(!showShare)}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
              >
                <Share2 size={16} /> Compartir oferta
              </button>
              {showShare && (
                <div className="absolute left-0 top-8 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-3 z-20 flex gap-2 animate-slide-up">
                  <button
                    onClick={shareWhatsApp}
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                  <button
                    onClick={shareFacebook}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? "Copiado" : "Copiar link"}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Users size={16} />
                <span>{job?.applications?.length || 0} postulantes</span>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all w-full md:w-auto shadow-lg shadow-red-600/25 hover:-translate-y-0.5"
              >
                Postularme ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ icon, label, color = 'default' }) {
  const cls = color === 'green'
    ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : 'bg-white/5 text-gray-300 border-white/10';
  return (
    <span className={`flex items-center gap-1.5 border ${cls} px-3 py-1.5 rounded-full text-xs font-medium`}>
      {icon}{label}
    </span>
  );
}

function Section({ title, content }) {
  return (
    <div>
      <h3 className="font-bold text-white mb-1.5">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
    </div>
  );
}
