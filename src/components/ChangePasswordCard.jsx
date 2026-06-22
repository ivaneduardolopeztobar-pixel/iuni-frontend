import { useState } from "react";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import api from "../api/client";

export default function ChangePasswordCard() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const rules = [
    { ok: form.newPassword.length >= 8, text: "Al menos 8 caracteres" },
    { ok: /[A-Z]/.test(form.newPassword), text: "Al menos una mayúscula" },
    { ok: /[0-9]/.test(form.newPassword), text: "Al menos un número" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    if (!rules.every(r => r.ok)) {
      setError("La nueva contraseña no cumple los requisitos");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
          <Lock size={16} />
        </div>
        <div>
          <h2 className="font-bold text-white">Cambiar contraseña</h2>
          <p className="text-gray-500 text-xs mt-0.5">Actualiza tu contraseña de forma segura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label="Contraseña actual"
          value={form.currentPassword}
          onChange={v => set("currentPassword", v)}
          show={show.current}
          toggle={() => setShow(s => ({ ...s, current: !s.current }))}
        />

        <PasswordField
          label="Nueva contraseña"
          value={form.newPassword}
          onChange={v => set("newPassword", v)}
          show={show.next}
          toggle={() => setShow(s => ({ ...s, next: !s.next }))}
        />
        {form.newPassword && (
          <div className="space-y-1 -mt-2">
            {rules.map((r, i) => (
              <div key={i} className={"flex items-center gap-1.5 text-xs " + (r.ok ? "text-green-400" : "text-gray-600")}>
                <div className={"w-1.5 h-1.5 rounded-full " + (r.ok ? "bg-green-400" : "bg-gray-700")} />
                {r.text}
              </div>
            ))}
          </div>
        )}

        <PasswordField
          label="Confirmar nueva contraseña"
          value={form.confirmPassword}
          onChange={v => set("confirmPassword", v)}
          show={show.confirm}
          toggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
        />
        {form.confirmPassword && form.newPassword !== form.confirmPassword && (
          <p className="text-red-500 text-xs -mt-2">Las contraseñas no coinciden</p>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-slide-up">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-2 animate-slide-up">
            <CheckCircle size={16} className="text-green-400 shrink-0" />
            <p className="text-green-400 text-sm">Contraseña actualizada exitosamente</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50 shadow-lg shadow-red-600/20"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all text-sm"
          required
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
