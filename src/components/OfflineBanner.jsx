import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, X } from "lucide-react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(!navigator.onLine);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRestored(true);
      setShow(true);
      setTimeout(() => { setShow(false); setRestored(false); }, 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setRestored(false);
      setShow(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={"fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all animate-bounce-once " +
      (restored
        ? "bg-green-900 border-green-700 text-green-300"
        : "bg-gray-950 border-red-700 text-red-400"
      )}>
      {restored ? (
        <>
          <RefreshCw size={16} className="shrink-0" />
          <span>Conexion restaurada</span>
        </>
      ) : (
        <>
          <WifiOff size={16} className="shrink-0" />
          <span>Sin conexion — algunas funciones no estaran disponibles</span>
          <button onClick={() => window.location.reload()} className="ml-2 underline text-xs hover:no-underline">
            Reintentar
          </button>
        </>
      )}
    </div>
  );
}
