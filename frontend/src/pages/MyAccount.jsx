import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaSave, FaTrash } from "react-icons/fa";

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/users/me").then(res => setUser(res.data)).catch(() => navigate("/login"));
  }, [navigate]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      await api.put("/users/me", { firstName: user.firstName, lastName: user.lastName, number: user.number });
      setMessage({ text: "Profile updated successfully.", type: "success" });
    } catch {
      setMessage({ text: "Update failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try { await api.delete("/users/me"); logout(); navigate("/"); }
    catch { setMessage({ text: "Delete failed.", type: "error" }); }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="w-8 h-8 border border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const fields = [
    { key: "firstName", label: "First Name", icon: <FaUser />, type: "text" },
    { key: "lastName", label: "Last Name", icon: <FaUser />, type: "text" },
    { key: "number", label: "Phone Number", icon: <FaPhone />, type: "tel" },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg"
      >
        {/* HEADER */}
        <div className="mb-12">
          <p className="section-label mb-3">Profile</p>
          <h1 className="font-serif text-5xl text-white font-semibold mb-2">My Account</h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/40 text-xs tracking-wide">
            {user.email}
            <span className="ml-3 text-[10px] border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-0.5 tracking-widest uppercase">
              {user.role}
            </span>
          </p>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 text-xs tracking-wider text-center ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="luxury-card p-8 space-y-5">
          {fields.map(({ key, label, icon, type }) => (
            <div key={key}>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">{label}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs">{icon}</span>
                <input
                  type={type}
                  className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                  value={user[key] || ""}
                  onChange={e => setUser({ ...user, [key]: e.target.value })}
                  placeholder={label}
                />
              </div>
            </div>
          ))}

          <div>
            <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/20 text-xs" />
              <input
                className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide opacity-40 cursor-not-allowed"
                value={user.email || ""}
                disabled
              />
            </div>
            <p className="text-[#E8E0D0]/25 text-[10px] tracking-wider mt-1">Email cannot be changed</p>
          </div>

          <div className="pt-4 space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={updateProfile}
              disabled={loading}
              className="btn-gold w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave size={12} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={deleteAccount}
              className="btn-ghost w-full py-4 flex items-center justify-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/5 hover:border-red-500/50"
            >
              <FaTrash size={12} /> Delete Account
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
