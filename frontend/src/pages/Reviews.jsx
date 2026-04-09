import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar, FaRegStar, FaArrowLeft, FaTrash, FaPaperPlane,
  FaUserCircle, FaHotel
} from "react-icons/fa";

export default function Reviews() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      const [revRes, ratingRes, hotelRes] = await Promise.all([
        api.get(`/reviews/hotel/${hotelId}`),
        api.get(`/reviews/hotel/${hotelId}/rating`),
        api.get(`/hotels/${hotelId}`).catch(() => ({ data: null }))
      ]);
      setReviews(revRes.data);
      setAvgRating(ratingRes.data);
      setHotel(hotelRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [hotelId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/reviews", { hotelId, ...form });
      setForm({ rating: 5, comment: "" });
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit review");
    } finally { setSubmitting(false); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  const StarRow = ({ value, interactive = false, size = 20 }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => setForm(f => ({ ...f, rating: i })) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          {i <= (interactive ? (hoverRating || value) : value)
            ? <FaStar size={size} className="text-amber-400" />
            : <FaRegStar size={size} className="text-gray-600" />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-5xl mx-auto">

        <button onClick={() => navigate(`/hotels/${hotelId}`)} className="flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C97A] text-sm mb-10 transition-colors uppercase tracking-widest text-xs font-semibold">
          <FaArrowLeft /> Back to Rooms
        </button>

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <p className="section-label mb-3">Guest Feedback</p>
          <div className="flex items-center gap-4 mb-2">
            <FaHotel className="text-[#C9A84C] text-4xl" />
            <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold">
              {hotel?.name || "Hotel"} Reviews
            </h1>
          </div>
          <div className="gold-divider-left mt-6 mb-3" />

          {/* RATING SUMMARY */}
          <div className="flex flex-col md:flex-row items-center gap-10 mt-8 p-8 luxury-card">
            <div className="text-center md:border-r border-[#C9A84C]/20 md:pr-10">
              <p className="text-7xl font-serif text-[#C9A84C] mb-2">{Math.round(avgRating.averageRating * 10) / 10}</p>
              <StarRow value={Math.round(avgRating.averageRating)} size={22} />
              <p className="text-[#E8E0D0]/40 text-xs tracking-widest uppercase mt-3">{avgRating.totalReviews} reviews</p>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = avgRating.totalReviews > 0 ? (count / avgRating.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4 text-sm">
                    <span className="text-[#E8E0D0]/60 w-4 font-serif text-lg">{star}</span>
                    <FaStar className="text-[#C9A84C]" size={14} />
                    <div className="flex-1 bg-[#111318] h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-[#C9A84C]"
                      />
                    </div>
                    <span className="text-[#E8E0D0]/40 w-8 text-right font-mono text-xs">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* WRITE REVIEW FORM */}
        {role === "CUSTOMER" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-14 p-8 luxury-card"
          >
            <h2 className="font-serif text-2xl text-white mb-6">Write a Review</h2>
            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-3 block">Your Rating</label>
                <div className="bg-[#111318] p-4 inline-block">
                  <StarRow value={form.rating} interactive size={32} />
                </div>
              </div>
              <div>
                <label className="text-[#E8E0D0]/60 text-xs tracking-widest uppercase mb-3 block">Your Comment</label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  rows={4}
                  className="luxury-input w-full px-4 py-4 placeholder:text-[#E8E0D0]/20 resize-none font-sans text-sm"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={submitting}
                className="btn-gold px-8 py-4 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{submitting ? "Submitting..." : "Submit Review"}</span>
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* REVIEWS LIST */}
        <h2 className="font-serif text-2xl text-white mb-6 flex items-center gap-3">
          <FaUserCircle className="text-[#C9A84C]" /> Guest Experiences
        </h2>

        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-[#111318] animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 luxury-card">
            <FaStar className="text-[#C9A84C]/30 text-6xl mx-auto mb-4" />
            <p className="font-serif text-4xl text-[#E8E0D0]/20 mb-3">No reviews yet</p>
             <p className="text-[#E8E0D0]/25 text-xs tracking-widest uppercase">Be the first to review this hotel!</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-5">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 luxury-card transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#111318] flex items-center justify-center text-[#C9A84C] font-serif text-xl border border-[#C9A84C]/20">
                        {r.userEmail?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-serif text-lg">{r.userEmail}</p>
                        <p className="text-[#E8E0D0]/40 text-[10px] tracking-widest uppercase mt-1">
                          {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StarRow value={r.rating} size={16} />
                      {r.userEmail === email && (
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteReview(r.id)}
                          className="badge-danger px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 hover:bg-red-500/20"
                        >
                          <FaTrash size={10} /> Delete
                        </motion.button>
                      )}
                    </div>
                  </div>
                  {r.comment && <p className="text-[#E8E0D0]/80 mt-4 text-sm leading-relaxed font-sans">{r.comment}</p>}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
