import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FaDoorOpen, FaBed, FaRupeeSign, FaUsers, FaArrowLeft } from "react-icons/fa";

export default function CreateRoom() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ roomNumber: "", type: "DELUXE", price: "", capacity: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "MANAGER") navigate("/");
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/rooms", { hotelId, ...form, price: Number(form.price), capacity: Number(form.capacity), available: true });
      navigate(`/hotels/${hotelId}`);
    } catch {
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <button onClick={() => navigate(`/hotels/${hotelId}`)} className="flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C97A] text-sm mb-10 transition-colors uppercase tracking-widest text-xs font-semibold">
          <FaArrowLeft /> Back to Rooms
        </button>

        <div className="mb-10">
          <p className="section-label mb-3">Accommodation</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-semibold mb-2">
            Add Room
          </h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/40 text-xs tracking-widest uppercase">Add a new room to this hotel</p>
        </div>

        <div className="luxury-card p-8">
          <form onSubmit={submit} className="space-y-6">

            <div>
              <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">Room Number</label>
              <div className="relative">
                <FaDoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                  placeholder="101"
                  value={form.roomNumber}
                  onChange={e => setForm({ ...form, roomNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">Room Type</label>
              <div className="relative">
                <FaBed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <select
                  className="luxury-input w-full pl-11 pr-4 py-3 appearance-none"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="DELUXE" className="bg-[#111318] text-[#E8E0D0]">Deluxe</option>
                  <option value="SINGLE" className="bg-[#111318] text-[#E8E0D0]">Single</option>
                  <option value="DOUBLE" className="bg-[#111318] text-[#E8E0D0]">Double</option>
                  <option value="SUITE" className="bg-[#111318] text-[#E8E0D0]">Suite</option>
                  <option value="PRESIDENTIAL" className="bg-[#111318] text-[#E8E0D0]">Presidential</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">Price per Night (₹)</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                  placeholder="3500"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">Guest Capacity</label>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                  placeholder="2"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })}
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
            >
              <span>{loading ? "Creating..." : "Create Room"}</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
