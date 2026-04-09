import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWifi, FaSwimmingPool, FaDumbbell, FaSpa, FaParking, FaUtensils,
  FaConciergeBell, FaTv, FaSnowflake, FaShuttleVan, FaPlus, FaTrash,
  FaArrowLeft, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

const AMENITY_ICONS = {
  WiFi: <FaWifi />, Pool: <FaSwimmingPool />, Gym: <FaDumbbell />,
  Spa: <FaSpa />, Parking: <FaParking />, Restaurant: <FaUtensils />,
  Concierge: <FaConciergeBell />, TV: <FaTv />, AC: <FaSnowflake />,
  Shuttle: <FaShuttleVan />
};

export default function Amenities() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [amenities, setAmenities] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "WiFi", icon: "FaWifi" });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [amRes, hotelRes] = await Promise.all([
        api.get(`/amenities/hotel/${hotelId}`),
        api.get(`/hotels/${hotelId}`).catch(() => ({ data: null }))
      ]);
      setAmenities(amRes.data);
      setHotel(hotelRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [hotelId]);

  const addAmenity = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/amenities", { hotelId, name: form.name, icon: form.icon, available: true });
      load();
    } catch { alert("Failed to add amenity"); } finally { setAdding(false); }
  };

  const toggleAmenity = async (a) => {
    await api.put(`/amenities/${a.id}`, { ...a, available: !a.available });
    load();
  };

  const deleteAmenity = async (id) => {
    if (!window.confirm("Delete this amenity?")) return;
    await api.delete(`/amenities/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-5xl mx-auto">

        <button onClick={() => navigate(`/hotels/${hotelId}`)} className="flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C97A] text-sm mb-10 transition-colors uppercase tracking-widest text-xs font-semibold">
          <FaArrowLeft /> Back to Rooms
        </button>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <p className="section-label mb-3">Facilities</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-2">
            {hotel?.name || "Hotel"} Amenities
          </h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/40 text-xs tracking-widest uppercase">{amenities.length} amenities configured</p>
        </motion.div>

        {/* ADD FORM — MANAGER ONLY */}
        {role === "MANAGER" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-12 p-8 luxury-card"
          >
            <h2 className="font-serif text-2xl text-white mb-5">Add Amenity</h2>
            <form onSubmit={addAmenity} className="flex gap-4 flex-wrap items-center">
              <select
                value={form.name}
                onChange={e => setForm({ name: e.target.value, icon: `Fa${e.target.value}` })}
                className="luxury-input px-4 py-3 appearance-none min-w-[200px]"
              >
                {Object.keys(AMENITY_ICONS).map(k => (
                  <option key={k} value={k} className="bg-[#111318] text-[#E8E0D0]">{k}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={adding}
                className="btn-gold px-8 py-3 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{adding ? "Adding..." : "Add"}</span>
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* AMENITIES GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-[#111318] rounded-none animate-pulse" />)}
          </div>
        ) : amenities.length === 0 ? (
          <div className="text-center py-20 luxury-card">
            <FaConciergeBell className="text-[#C9A84C]/30 text-6xl mx-auto mb-4" />
            <p className="font-serif text-4xl text-[#E8E0D0]/20 mb-3">No amenities added yet</p>
            <p className="text-[#E8E0D0]/25 text-xs tracking-widest uppercase">Add facilities above</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <AnimatePresence>
              {amenities.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative p-6 luxury-card text-center transition-all ${
                    a.available ? "" : "opacity-50 grayscale"
                  }`}
                >
                  <div className={`text-4xl mb-4 flex justify-center ${a.available ? "text-[#C9A84C]" : "text-[#E8E0D0]/30"}`}>
                    {AMENITY_ICONS[a.name] || <FaConciergeBell />}
                  </div>
                  <p className={`font-serif text-lg mb-2 ${a.available ? "text-white" : "text-[#E8E0D0]/50"}`}>{a.name}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {a.available
                      ? <FaCheckCircle className="text-green-500" size={12} />
                      : <FaTimesCircle className="text-red-500" size={12} />}
                    <span className={`text-[10px] tracking-widest uppercase ${a.available ? "text-green-500" : "text-red-500"}`}>
                      {a.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {role === "MANAGER" && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button onClick={() => toggleAmenity(a)}
                        className={`badge-warning px-2 py-1 text-[10px] tracking-widest uppercase transition-all`}
                        title="Toggle"
                      >
                        {a.available ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => deleteAmenity(a.id)}
                        className="badge-danger px-2 py-1 text-[10px] tracking-widest uppercase transition-all"
                        title="Delete"
                      >
                        Del
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
