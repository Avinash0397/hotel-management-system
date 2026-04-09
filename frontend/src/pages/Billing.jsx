import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHotel, FaBed, FaCalendarAlt, FaRupeeSign, FaCreditCard,
  FaCheckCircle, FaArrowLeft, FaTag, FaTimesCircle, FaUsers
} from "react-icons/fa";

export default function Billing() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    api.get(`/rooms/${roomId}`).then(res => setRoom(res.data)).catch(() => {});
  }, [roomId]);

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const basePrice = room ? room.price * nights : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPrice = Math.max(0, basePrice - discount);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponResult(null);
    try {
      const res = await api.post("/coupons/validate", { code: couponCode.toUpperCase(), amount: basePrice });
      setCouponResult({ success: true, message: res.data.message });
      setAppliedCoupon(res.data);
    } catch (err) {
      setCouponResult({ success: false, message: err?.response?.data?.message || "Invalid coupon code" });
      setAppliedCoupon(null);
    } finally { setCouponLoading(false); }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponResult(null); setCouponCode(""); };

  const createBooking = async () => {
    if (new Date(checkOut) <= new Date(checkIn)) { alert("Check-out must be after check-in"); return; }
    try {
      setLoading(true);
      const res = await api.post("/bookings", { roomId, hotelId, checkIn, checkOut, totalPrice });
      if (appliedCoupon?.couponId) await api.post(`/coupons/apply/${appliedCoupon.couponId}`).catch(() => {});
      setBooking(res.data);
    } catch { alert("Booking failed. Please try again."); }
    finally { setLoading(false); }
  };

  const payNow = async () => {
    try {
      setLoading(true);
      const created = await api.post("/payments/create", { bookingId: booking.id, amount: booking.totalPrice });
      await api.post(`/payments/${created.data.id}/process`);
      navigate("/dashboard");
    } catch { alert("Payment failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#C9A84C]/60 hover:text-[#C9A84C] text-xs tracking-widest uppercase mb-8 transition-colors">
          <FaArrowLeft size={10} /> Back
        </button>

        <div className="mb-10">
          <p className="section-label mb-3">{booking ? "Payment" : "Reservation"}</p>
          <h1 className="font-serif text-5xl text-white font-semibold mb-2">
            {booking ? "Complete Payment" : "Confirm Booking"}
          </h1>
          <div className="gold-divider-left mt-4" />
        </div>

        <div className="luxury-card p-8 space-y-6">

          {/* ROOM INFO */}
          {room && (
            <div className="flex items-center gap-4 p-4 border border-[#C9A84C]/10 bg-[#111318]">
              <div className="w-10 h-10 border border-[#C9A84C]/20 flex items-center justify-center">
                <FaBed className="text-[#C9A84C]" size={16} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{room.type} Room</p>
                <p className="text-[#E8E0D0]/40 text-xs flex items-center gap-2 mt-0.5">
                  Room {room.roomNumber} · <FaUsers size={9} className="text-[#C9A84C]" /> {room.capacity} guests
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[#C9A84C] font-serif">₹{room.price?.toLocaleString()}</p>
                <p className="text-[#E8E0D0]/30 text-[10px] tracking-wider">per night</p>
              </div>
            </div>
          )}

          {/* DATE PICKERS */}
          {!booking && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Check-in", value: checkIn, min: today, set: setCheckIn },
                { label: "Check-out", value: checkOut, min: checkIn || today, set: setCheckOut },
              ].map(({ label, value, min, set }) => (
                <div key={label}>
                  <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2 block">
                    <FaCalendarAlt className="text-[#C9A84C]/50" size={9} /> {label}
                  </label>
                  <input
                    type="date" min={min} value={value}
                    onChange={e => { set(e.target.value); setAppliedCoupon(null); setCouponResult(null); }}
                    className="luxury-input w-full px-4 py-3 text-sm [color-scheme:dark]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* COUPON */}
          {!booking && (
            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2 block">
                <FaTag className="text-[#C9A84C]/50" size={9} /> Coupon Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-400" size={12} />
                    <span className="text-green-400 font-mono text-sm font-bold">{couponCode.toUpperCase()}</span>
                    <span className="text-green-300 text-xs">— Save ₹{discount.toFixed(0)}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-[#E8E0D0]/30 hover:text-red-400 transition-colors">
                    <FaTimesCircle size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="luxury-input flex-1 px-4 py-3 text-sm font-mono tracking-widest uppercase"
                    onKeyDown={e => e.key === "Enter" && validateCoupon()}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={validateCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-ghost px-5 py-3 disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </motion.button>
                </div>
              )}
              <AnimatePresence>
                {couponResult && !appliedCoupon && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`text-[10px] mt-2 tracking-wider flex items-center gap-1 ${couponResult.success ? "text-green-400" : "text-red-400"}`}
                  >
                    {couponResult.success ? <FaCheckCircle size={9} /> : <FaTimesCircle size={9} />}
                    {couponResult.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* PRICE SUMMARY */}
          <div className="space-y-3 p-4 border border-[#C9A84C]/10 bg-[#111318]">
            <div className="flex justify-between text-xs text-[#E8E0D0]/40 tracking-wide">
              <span>Room rate</span>
              <span>₹{room?.price?.toLocaleString() || 0} × {nights} night{nights > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between text-xs text-[#E8E0D0]/40 tracking-wide">
              <span>Base total</span>
              <span>₹{basePrice.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-green-400 tracking-wide">
                <span className="flex items-center gap-1"><FaTag size={9} /> Coupon discount</span>
                <span>− ₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-[#E8E0D0]/40 tracking-wide">
              <span>Taxes & fees</span>
              <span className="text-green-400">Included</span>
            </div>
            <div className="border-t border-[#C9A84C]/10 pt-3 flex justify-between items-end">
              <span className="text-white text-sm tracking-widest uppercase">Total</span>
              <div className="text-right">
                {discount > 0 && <p className="text-[#E8E0D0]/25 text-xs line-through">₹{basePrice.toLocaleString()}</p>}
                <span className="text-[#C9A84C] font-serif text-2xl flex items-center gap-1">
                  <FaRupeeSign size={14} />{(booking?.totalPrice ?? totalPrice).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* IDS */}
          <div className="space-y-1 text-[10px] text-[#E8E0D0]/20 tracking-wider">
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><FaHotel size={9} /> Hotel ID</span>
              <span className="font-mono">{hotelId?.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><FaBed size={9} /> Room ID</span>
              <span className="font-mono">{roomId?.slice(0, 12)}...</span>
            </div>
          </div>

          {/* ACTION */}
          {!booking ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              onClick={createBooking}
              className="btn-gold w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaCheckCircle size={12} />
              <span>{loading ? "Creating Booking..." : `Confirm Booking — ₹${totalPrice.toLocaleString()}`}</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              onClick={payNow}
              className="btn-gold w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaCreditCard size={12} />
              <span>{loading ? "Processing Payment..." : `Pay ₹${booking.totalPrice?.toLocaleString()}`}</span>
            </motion.button>
          )}

          <p className="text-center text-[#E8E0D0]/20 text-[10px] tracking-widest uppercase">
            🔒 Secure · SSL Encrypted
          </p>
        </div>
      </motion.div>
    </div>
  );
}
