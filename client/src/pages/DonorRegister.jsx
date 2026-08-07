import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DonorRegister() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

      const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  bloodGroup: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          "https://raktsetu-d1bz.onrender.com/api/donors/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "donor",
          JSON.stringify(res.data.donor)
        );

        alert("Login Successful ✅");

        navigate("/donor-dashboard");
      } else {
        navigator.geolocation.getCurrentPosition(
  async (position) => {
    const updatedData = {
      ...formData,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    await axios.post(
      "https://raktsetu-d1bz.onrender.com/api/donors/register",
      updatedData
    );

    alert("Registration Successful ✅");

    setIsLogin(true);
  },
  () => {
    alert("Please allow location access to register.");
  }
);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-xl w-[500px]"
      >

        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">

          {isLogin ? "Donor Login" : "Donor Registration"}

        </h1>

        {!isLogin && (
          <>
            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Weight"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <input
              className="border p-3 rounded w-full mb-3"
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
            />
          </>
        )}

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="border p-3 rounded w-full mb-5"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="bg-red-600 text-white w-full p-3 rounded-lg hover:bg-red-700">

          {isLogin ? "Login" : "Register"}

        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-5 text-center cursor-pointer text-red-600"
        >
          {isLogin
            ? "New Donor? Register"
            : "Already Registered? Login"}
        </p>

      </form>

    </div>
  );
}