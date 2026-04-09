// This component is superseded by Rooms.jsx
// Kept for backward compatibility — redirects to Rooms
import { Navigate, useParams } from "react-router-dom";

export default function HotelDetails() {
  const { hotelId } = useParams();
  return <Navigate to={`/hotels/${hotelId}`} replace />;
}
