import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaMapMarkerAlt, FaToggleOn, FaToggleOff, FaTrash, FaSearch } from "react-icons/fa";

const images = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c7",
];

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const loadHotels = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hotels");
      setHotels(res.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadHotels(); }, []);

  const toggleActive = async (hotel) => {
    await api.put(`/hotels/${hotel.id}`, {
      name: hotel.name, city: hotel.city, address: hotel.address, active: !hotel.active
    });
    setHotels(prev => prev.map(h => h.id === hotel.id ? { ...h, active: !h.active } : h));
  };

  const deleteHotel = async (id) => {
    if (!window.confirm("Delete hotel and all rooms?")) return;
    const rooms = await api.get(`/rooms/hotel/${id}`);
    for (let r of rooms.data) await api.delete(`/rooms/${r.id}`);
    await api.delete(`/hotels/${id}`);
    loadHotels();
  };

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Our Collection</p>
          <h1 className="font-serif text-6xl md:text-7xl text-white font-semibold mb-4">
            Luxury <em className="gold-text not-italic">Properties</em>
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="gold-divider mt-6 mb-4"
          />
          <p className="text-[#E8E0D0]/40 text-sm tracking-wide">{hotels.length} premium properties available</p>
        </motion.div>

        {/* SEARCH + ADD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 justify-center mb-14"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or city..."
              className="luxury-input pl-10 pr-6 py-3 text-sm tracking-wide w-full md:w-80"
            />
          </div>
          {role === "MANAGER" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/manager/create-hotel")}
              className="btn-gold px-6 py-3 flex items-center gap-2"
            >
              <span className="flex items-center gap-2"><FaPlus size={11} /> Add Property</span>
            </motion.button>
          )}
        </motion.div>

        {/* SKELETON */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="luxury-card overflow-hidden animate-pulse">
                <div className="h-64 bg-[#1C1F26]" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-[#1C1F26] rounded w-3/4" />
                  <div className="h-3 bg-[#1C1F26] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="relative group"
              >
                {!hotel.active && (
                  <span className="absolute top-4 left-4 bg-red-900/80 text-red-300 text-[10px] px-3 py-1 z-10 tracking-widest uppercase">
                    Unavailable
                  </span>
                )}

                <div
                  onClick={() => (hotel.active || role === "MANAGER") && navigate(`/hotels/${hotel.id}`)}
                  className={`luxury-card overflow-hidden ${hotel.active ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={`${images[i % images.length]}?w=600&q=80`}
                      className="h-full w-full object-cover img-zoom"
                      alt={hotel.name}
                    />
                    <div className="absolute inset-0 overlay-bottom" />

                    {/* INNER BORDER ON HOVER */}
                    <div className="absolute inset-3 border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/30 transition-all duration-500" />

                    <div className="absolute bottom-4 left-4">
                      <span className={`text-[10px] px-3 py-1 tracking-widest uppercase ${hotel.active ? "badge-success" : "badge-danger"}`}>
                        {hotel.active ? "● Available" : "● Closed"}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <h2 className="font-serif text-xl text-white mb-2 group-hover:text-[#E8C97A] transition-colors duration-300">
                      {hotel.name}
                    </h2>
                    <div className="gold-divider-left mb-3" />
                    <p className="text-[#E8E0D0]/40 flex items-center gap-2 text-xs tracking-wide mb-1">
                      <FaMapMarkerAlt className="text-[#C9A84C]" /> {hotel.city}
                    </p>
                    <p className="text-[#E8E0D0]/30 text-xs tracking-wide">{hotel.address}</p>
                    <div className="mt-5 pt-4 border-t border-[#C9A84C]/8 flex items-center justify-between">
                      <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase">View Rooms</span>
                      <span className="text-[#C9A84C]/50 text-xs">→</span>
                    </div>
                  </div>
                </div>

                {/* MANAGER ACTIONS */}
                {role === "MANAGER" && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); toggleActive(hotel); }}
                      className={`p-2 text-xs ${hotel.active ? "bg-green-900/80 text-green-400" : "bg-[#1C1F26] text-[#E8E0D0]/50"} border border-[#C9A84C]/20`}
                      title={hotel.active ? "Deactivate" : "Activate"}
                    >
                      {hotel.active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); deleteHotel(hotel.id); }}
                      className="p-2 bg-red-900/60 text-red-400 border border-red-500/20"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-full text-center py-24">
                <p className="font-serif text-4xl text-[#E8E0D0]/20 mb-4">No Properties Found</p>
                <p className="text-[#E8E0D0]/30 text-xs tracking-widest uppercase">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
