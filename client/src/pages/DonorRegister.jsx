import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function DonorRegister() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "A+",
    age: "",
    weight: "",
    city: "",
    lastDonationDate: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitRegistration = async (lat, lng) => {
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        latitude: lat || (formData.latitude ? Number(formData.latitude) : 17.38504),
        longitude: lng || (formData.longitude ? Number(formData.longitude) : 78.48667),
      };

      await api.post("/api/donors/register", payload);

      alert("Registration Successful ✅ Please log in.");
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/api/donors/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("donor", JSON.stringify(res.data.donor));

        alert("Login Successful ✅");
        navigate("/donor-dashboard");
        setLoading(false);
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              submitRegistration(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
              console.warn("Geolocation warning:", error);
              // Fallback to coordinates if geolocation is blocked or unavailable
              submitRegistration(null, null);
            },
            { timeout: 5000 }
          );
        } else {
          submitRegistration(null, null);
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server Error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-[520px] max-w-full border border-red-50"
      >
        <h1 className="text-3xl font-extrabold text-center text-red-600 mb-6">
          {isLogin ? "Donor Login" : "Donor Registration"}
        </h1>

        {!isLogin && (
          <>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <input
              className="border p-3 rounded-lg w-full mb-3 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
            <input
              className="border p-3 rounded-lg w-full mb-3 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. 9876543210"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Group</label>
            <select
              className="border p-3 rounded-lg w-full mb-3 outline-none focus:ring-2 focus:ring-red-500 bg-white"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Age</label>
                <input
                  className="border p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Age (18-60)"
                  type="number"
                  name="age"
                  min="18"
                  max="60"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (KG)</label>
                <input
                  className="border p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Weight (50+ KG)"
                  type="number"
                  name="weight"
                  min="50"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
            <input
              className="border p-3 rounded-lg w-full mb-3 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Hyderabad"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <label className="block text-xs font-semibold text-gray-600 mb-1">Last Donation Date (Optional)</label>
            <input
              className="border p-3 rounded-lg w-full mb-4 outline-none focus:ring-2 focus:ring-red-500"
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
            />
          </>
        )}

        <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
        <input
          className="border p-3 rounded-lg w-full mb-3 outline-none focus:ring-2 focus:ring-red-500"
          placeholder="your.email@example.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
        <input
          className="border p-3 rounded-lg w-full mb-6 outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white w-full p-4 rounded-lg hover:bg-red-700 font-bold transition shadow-lg"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-center cursor-pointer text-red-600 font-medium hover:underline"
        >
          {isLogin ? "New Donor? Register Here" : "Already Registered? Login"}
        </p>
      </form>
    </div>
  );
}