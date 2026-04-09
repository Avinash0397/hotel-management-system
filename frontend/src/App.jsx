import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Chatbot from "./components/Chatbot";
import VerifyOtp from "./auth/VerifyOtp";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Hotels from "./pages/Hotel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyAccount from "./pages/MyAccount";
import CreateHotel from "./pages/CreateHotel";
import Rooms from "./pages/Rooms";
import CreateRoom from "./pages/CreateRoom";
import EditRoom from "./pages/EditRoom";
import Billing from "./pages/Billing";
import Reviews from "./pages/Reviews";
import Amenities from "./pages/Amenities";
import Coupons from "./pages/Coupons";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* HOTELS */}
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:hotelId" element={<Rooms />} />
            <Route path="/hotels/:hotelId/reviews" element={<Reviews />} />
            <Route path="/hotels/:hotelId/amenities" element={<Amenities />} />

            {/* COUPONS (public view) */}
            <Route path="/coupons" element={<Coupons />} />

            {/* MANAGER ONLY */}
            <Route path="/manager/create-hotel" element={<CreateHotel />} />
            <Route path="/manager/create-room/:hotelId" element={<CreateRoom />} />
            <Route path="/manager/edit-room/:roomId" element={<EditRoom />} />

            {/* BOOKING */}
            <Route path="/book/:roomId" element={<Billing />} />

            {/* PROTECTED */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Routes>
          <Chatbot />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
