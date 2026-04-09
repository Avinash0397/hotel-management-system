import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHotel, FaCity, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";

export default function CreateHotel() {
  const [form, setForm] = useState({ name: "", city: "", address: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/hotels", { ...form, active: true });
      navigate("/hotels");
    } catch {
      alert("Failed to create hotel");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Hotel Name", icon: <FaHotel />, placeholder: "Grand Palace Hotel" },
    { key: "city", label: "City", icon: <FaCity />, placeholder: "Mumbai" },
    { key: "address", label: "Address", icon: <FaMapMarkerAlt />, placeholder: "Near Airport Road, Andheri East" },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <button onClick={() => navigate("/hotels")} className="flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C97A] text-sm mb-10 transition-colors uppercase tracking-widest text-xs font-semibold">
          <FaArrowLeft /> Back to Hotels
        </button>

        <div className="mb-10">
          <p className="section-label mb-3">Portfolio</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-semibold mb-2">
            Create Hotel
          </h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/40 text-xs tracking-widest uppercase">Add a new property to your portfolio</p>
        </div>

        <div className="luxury-card p-8">
          <form onSubmit={submit} className="space-y-6">
            {fields.map(({ key, label, icon, placeholder }) => (
              <div key={key}>
                <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">{label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">{icon}</span>
                  <input
                    className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required
                  />
                </div>
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
            >
              <span>{loading ? "Creating..." : "Create Hotel"}</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
