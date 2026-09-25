import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import DonorRegister from "./pages/DonorRegister";
import DonorDashboard from "./pages/DonorDashboard";
import DonorResponse from "./pages/DonorResponse";
import AcceptedDonorsDashboard from "./pages/AcceptedDonorsDashboard";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/hospital-login"
        element={<HospitalLogin />}
      />

      <Route
        path="/dashboard"
        element={<HospitalDashboard />}
      />

      <Route
        path="/donor-register"
        element={<DonorRegister />}
      />

      <Route
        path="/donor-dashboard"
        element={<DonorDashboard />}
      />

      {/* One common public response link */}
      <Route
        path="/respond/:requestId"
        element={<DonorResponse />}
      />

      {/* Hospital accepted responses dashboard */}
      <Route
        path="/accepted-donors/:requestId"
        element={
          <AcceptedDonorsDashboard />
        }
      />
    </Routes>
  );
}