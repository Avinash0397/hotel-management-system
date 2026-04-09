import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { roomImages } from "../utils/roomImages";
import { motion } from "framer-motion";
import {
  FaPlus, FaBed, FaUsers, FaEdit, FaTrash,
  FaArrowLeft, FaStar, FaWifi
} from "react-icons/fa";

export default function Rooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [amenityCount, setAmenityCount] = useState(0);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const loadRooms = async () => {
    try {
      setLoading(true);
      const [roomsRes, hotelRes, ratingRes, amenRes] = await Promise.all([
        api.get(`/rooms/hotel/${hotelId}`),
        api.get(`/hotels/${hotelId}`).catch(() => ({ data: null })),
        api.get(`/reviews/hotel/${hotelId}/rating`).catch(() => ({ data: { averageRating: 0 } })),
        api.get(`/amenities/hotel/${hotelId}`).catch(() => ({ data: [] }))
      ]);
      setRooms(roomsRes.data);
      setHotel(hotelRes.data);
      setAvgRating(ratingRes.data.averageRating || 0);
      setAmenityCount(amenRes.data.length);
    } catch (err) {
      console.error("Failed to load rooms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (hotelId) loadRooms(); }, [hotelId]);

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    await api.delete(`/rooms/${id}`);
    loadRooms();
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* BACK + HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <button
            onClick={() => navigate("/hotels")}
            className="flex items-center gap-2 text-[#C9A84C]/60 hover:text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-8 transition-colors"
          >
            <FaArrowLeft size={10} /> Back to Collection
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="section-label mb-3">Accommodation</p>
              <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-2">
                {hotel?.name || "Rooms"}
              </h1>
              {hotel && (
                <p className="text-[#E8E0D0]/40 text-xs tracking-widest uppercase">
                  {hotel.city} &nbsp;·&nbsp; {rooms.length} Rooms Available
                </p>
              )}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="gold-divider-left mt-4"
              />

              {/* QUICK LINKS */}
              <div className="flex gap-3 mt-5 flex-wrap">
                <button
                  onClick={() => navigate(`/hotels/${hotelId}/reviews`)}
                  className="btn-ghost text-[10px] px-4 py-2 flex items-center gap-2"
                >
                  <FaStar size={10} /> Reviews {avgRating > 0 && `· ${avgRating}★`}
                </button>
                <button
                  onClick={() => navigate(`/hotels/${hotelId}/amenities`)}
                  className="btn-ghost text-[10px] px-4 py-2 flex items-center gap-2"
                >
                  <FaWifi size={10} /> Amenities {amenityCount > 0 && `· ${amenityCount}`}
                </button>
              </div>
            </div>

            {role === "MANAGER" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/manager/create-room/${hotelId}`)}
                className="btn-gold px-6 py-3 flex items-center gap-2"
              >
                <span className="flex items-center gap-2"><FaPlus size={11} /> Add Room</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* SKELETON */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="luxury-card overflow-hidden animate-pulse">
                <div className="h-56 bg-[#1C1F26]" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-[#1C1F26] rounded w-3/4" />
                  <div className="h-3 bg-[#1C1F26] rounded w-1/2" />
                  <div className="h-10 bg-[#1C1F26] rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ROOMS GRID */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="luxury-card overflow-hidden group"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={`${roomImages[i % roomImages.length]}?w=600&q=80`}
                    className="h-full w-full object-cover img-zoom"
                    alt={room.type}
                  />
                  <div className="absolute inset-0 overlay-bottom" />
                  <div className="absolute inset-3 border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/25 transition-all duration-500" />

                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] px-3 py-1 tracking-widest uppercase ${room.available ? "badge-success" : "badge-danger"}`}>
                      {room.available ? "● Available" : "● Booked"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#C9A84C]/90 text-[#0D1117] text-[10px] px-3 py-1 tracking-widest uppercase font-semibold">
                      {room.type}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-serif text-xl text-white group-hover:text-[#E8C97A] transition-colors">
                      {room.type}
                    </h2>
                    <div className="text-right">
                      <span className="gold-text font-serif text-xl font-semibold">₹{room.price?.toLocaleString()}</span>
                      <p className="text-[#E8E0D0]/30 text-[10px] tracking-widest">per night</p>
                    </div>
                  </div>

                  <div className="gold-divider-left mb-4" />

                  <div className="flex gap-5 text-xs text-[#E8E0D0]/40 tracking-wide mb-5">
                    <span className="flex items-center gap-1.5">
                      <FaBed className="text-[#C9A84C]" size={11} /> Room {room.roomNumber}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaUsers className="text-[#C9A84C]" size={11} /> {room.capacity} Guests
                    </span>
                  </div>

                  {role === "CUSTOMER" && room.available && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/book/${room.id}?hotelId=${hotelId}`)}
                      className="btn-gold w-full py-3"
                    >
                      <span>Reserve Now</span>
                    </motion.button>
                  )}

                  {role === "CUSTOMER" && !room.available && (
                    <div className="w-full border border-[#E8E0D0]/8 text-[#E8E0D0]/25 py-3 text-center text-[10px] tracking-[0.2em] uppercase">
                      Not Available
                    </div>
                  )}

                  {role === "MANAGER" && (
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/manager/edit-room/${room.id}`)}
                        className="flex-1 border border-blue-500/20 bg-blue-900/10 text-blue-400/70 hover:text-blue-400 hover:border-blue-500/40 py-2.5 flex items-center justify-center gap-2 text-xs tracking-wider transition-all"
                      >
                        <FaEdit size={11} /> Edit
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteRoom(room.id)}
                        className="flex-1 border border-red-500/20 bg-red-900/10 text-red-400/70 hover:text-red-400 hover:border-red-500/40 py-2.5 flex items-center justify-center gap-2 text-xs tracking-wider transition-all"
                      >
                        <FaTrash size={11} /> Delete
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {rooms.length === 0 && !loading && (
              <div className="col-span-full text-center py-24">
                <p className="font-serif text-4xl text-[#E8E0D0]/20 mb-4">No Rooms Available</p>
                {role === "MANAGER" && (
                  <button
                    onClick={() => navigate(`/manager/create-room/${hotelId}`)}
                    className="btn-gold px-8 py-3 mt-4"
                  >
                    <span>Add First Room</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
