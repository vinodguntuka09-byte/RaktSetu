import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HospitalLogin() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hospitalName: "",
    licenseNumber: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    contactPerson: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        alert("Location Captured Successfully ✅");
      },
      () => {
        alert("Unable to fetch location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/hospitals/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "hospital",
          JSON.stringify(res.data.hospital)
        );

        alert("Login Successful ✅");

        navigate("/dashboard");
      } else {
        await axios.post(
          "http://localhost:5000/api/hospitals/register",
          formData
        );

        alert("Hospital Registered Successfully ✅");

        setIsLogin(true);

        setFormData({
          hospitalName: "",
          licenseNumber: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          contactPerson: "",
          latitude: "",
          longitude: "",
        });
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-100 px-4 py-8">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-12 w-[700px]"
      >

        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-10">

          {isLogin
            ? "Hospital Login"
            : "Hospital Registration"}

        </h1>

        {!isLogin && (
          <>
		            <input
              type="text"
              name="hospitalName"
              placeholder="Hospital Name"
              value={formData.hospitalName}
              onChange={handleChange}
              className="w-full border p-4 text-lg rounded-lg mb-4"
              required
            />

            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border p-4 text-lg rounded-lg mb-4"
              required
            />

            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full border p-4 text-lg rounded-lg mb-4"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Hospital Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-4 text-lg rounded-lg mb-4"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Hospital Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-4 text-lg rounded-lg mb-4"
              required
            />

            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-blue-600 text-white p-4 text-lg rounded-lg hover:bg-blue-700 mb-4"
            >
              📍 Use My Current Location
            </button>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={formData.latitude}
                readOnly
                placeholder="Latitude"
                className="border p-3 rounded-lg bg-gray-100"
              />

              <input
                type="text"
                value={formData.longitude}
                readOnly
                placeholder="Longitude"
                className="border p-3 rounded-lg bg-gray-100"
              />
            </div>
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Hospital Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-4 text-lg rounded-lg mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-4 text-lg rounded-lg mb-6"
          required
        />
		
		        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white p-4 text-lg rounded-lg hover:bg-red-700 transition"
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-8 text-lg text-center text-red-600 cursor-pointer hover:underline"
        >
          {isLogin
            ? "New Hospital? Register Here"
            : "Already Registered? Login"}
        </p>

      </form>

    </div>
  );
}