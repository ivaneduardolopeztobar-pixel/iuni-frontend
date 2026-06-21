import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="text-center max-w-md relative animate-fade-in">
        <h1 className="text-6xl font-black mb-2">
          <span className="text-red-600">i</span>UNI
        </h1>
        <p className="text-8xl font-black text-white/10 my-8">404</p>
        <h2 className="text-2xl font-bold mb-2 text-white">Pagina no encontrada</h2>
        <p className="text-gray-500 text-sm mb-8">
          La pagina que buscas no existe o fue movida.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 hover:-translate-y-0.5"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
