import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FaBed, FaRupeeSign, FaUsers, FaDoorOpen, FaArrowLeft, FaSave } from "react-icons/fa";

export default function EditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "MANAGER") navigate("/");
  }, [navigate]);

  useEffect(() => {
    api.get(`/rooms/${roomId}`).then(res => setRoom(res.data)).catch(() => alert("Failed to load room"));
  }, [roomId]);

  const updateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/rooms/${roomId}`, {
        roomNumber: room.roomNumber, type: room.type,
        price: Number(room.price), capacity: Number(room.capacity), available: room.available
      });
      navigate(-1);
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C97A] text-sm mb-10 transition-colors uppercase tracking-widest text-xs font-semibold">
          <FaArrowLeft /> Back
        </button>

        <div className="mb-10">
          <p className="section-label mb-3">Accommodation</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-semibold mb-2">
            Edit Room
          </h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/40 text-xs tracking-widest uppercase">Update room details</p>
        </div>

        <div className="luxury-card p-8">
          <form onSubmit={updateRoom} className="space-y-6">

            <div>
              <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">Room Number</label>
              <div className="relative">
                <FaDoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                  value={room.roomNumber}
                  onChange={e => setRoom({ ...room, roomNumber: e.target.value })}
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
                  value={room.type}
                  onChange={e => setRoom({ ...room, type: e.target.value })}
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
                  type="number" min="1"
                  className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                  value={room.price}
                  onChange={e => setRoom({ ...room, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-2 block">Guest Capacity</label>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  type="number" min="1"
                  className="luxury-input w-full pl-11 pr-4 py-3 placeholder:text-[#E8E0D0]/20"
                  value={room.capacity}
                  onChange={e => setRoom({ ...room, capacity: e.target.value })}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group mt-2 mb-2">
              <div className={`w-12 h-6 rounded-full transition-all ${room.available ? "bg-[#C9A84C]" : "bg-gray-600"} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${room.available ? "left-6" : "left-0.5"}`} />
                <input
                  type="checkbox"
                  className="hidden"
                  checked={room.available}
                  onChange={e => setRoom({ ...room, available: e.target.checked })}
                />
              </div>
              <span className="text-[#E8E0D0]/80 text-sm tracking-widest uppercase text-xs">Room Available</span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
            >
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
