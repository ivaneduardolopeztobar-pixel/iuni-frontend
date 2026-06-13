import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black mb-2">
          <span className="text-red-600">i</span>UNI
        </h1>
        <p className="text-8xl font-black text-gray-800 my-8">404</p>
        <h2 className="text-2xl font-bold mb-2">Pagina no encontrada</h2>
        <p className="text-gray-500 text-sm mb-8">
          La pagina que buscas no existe o fue movida.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
