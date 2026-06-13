import { WifiOff } from "lucide-react";

export default function ErrorMsg({ onRetry, message }) {
  return (
    <div className="text-center py-20 text-gray-600">
      <div className="w-16 h-16 bg-gray-950 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <WifiOff size={24} className="text-gray-600" />
      </div>
      <p className="font-bold text-gray-400 mb-2">
        {message || "No se pudo conectar al servidor"}
      </p>
      <p className="text-sm mb-4">Verifica tu conexion a internet</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
