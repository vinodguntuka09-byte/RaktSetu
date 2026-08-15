import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import api from "../api";

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const hospital = JSON.parse(localStorage.getItem("hospital") || "null");

  const [requests, setRequests] = useState([]);
  const [eligibleDonors, setEligibleDonors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  const [formData, setFormData] = useState({
    bloodGroup: "A+",
    units: "",
    urgency: "Critical",
    doctorName: "",
    doctorPhone: "",
    radius: "",
  });

  const logout = () => {
    localStorage.clear();
    navigate("/hospital-login");
  };

  const loadRequests = async () => {
    try {
      const res = await api.get("/api/requests/all");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!hospital) {
      navigate("/hospital-login");
      return;
    }
    loadRequests();
  }, []);

  const loadEligibleDonors = async (requestId) => {
    try {
      setMapLoading(true);
      setSelectedHospital(null);
      setEligibleDonors([]);
      const res = await api.get(`/api/requests/eligible/${requestId}`);
      setEligibleDonors(res.data.donors || []);
      setSelectedHospital(res.data.hospital);
    } catch (err) {
      console.error(err);
      alert("Failed to load eligible donors");
    } finally {
      setMapLoading(false);
    }
  };

  const completeRequest = async (requestId) => {
    try {
      await api.put("/api/requests/complete", { requestId });
      alert("Request Completed ✅");
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to Complete Request");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hospital || !hospital._id) {
      alert("Hospital session invalid. Please log in again.");
      navigate("/hospital-login");
      return;
    }

    try {
      await api.post("/api/requests/create", {
        hospital: hospital._id,
        ...formData,
        units: Number(formData.units),
        radius: Number(formData.radius),
      });

      alert("Blood Request Created ✅");

      setFormData({
        bloodGroup: "A+",
        units: "",
        urgency: "Critical",
        doctorName: "",
        doctorPhone: "",
        radius: "",
      });

      loadRequests();
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-gray-100">
      <div className="w-full bg-red-600 text-white shadow-lg px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wide">
            Welcome <span className="text-yellow-300">{hospital?.hospitalName}</span>
          </h1>
          <p className="text-red-100 mt-1">Hospital Dashboard</p>
        </div>

        <button
          onClick={logout}
          className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-2 rounded-lg transition-all duration-300 ml-10 shadow"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Blood Request</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group Required</label>
              <select
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Units Required</label>
              <input
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                name="units"
                placeholder="Number of units"
                type="number"
                min="1"
                value={formData.units}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Urgency Level</label>
              <select
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="Critical">Critical</option>
                <option value="Within 24 hrs">Within 24 hrs</option>
                <option value="Within a week">Within a week</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Doctor Name</label>
              <input
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                name="doctorName"
                placeholder="Doctor Name"
                value={formData.doctorName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Doctor Contact Phone</label>
              <input
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                name="doctorPhone"
                placeholder="Doctor Phone Number"
                value={formData.doctorPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Search Radius (KM)</label>
              <input
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                name="radius"
                placeholder="Search radius in kilometers"
                type="number"
                min="1"
                value={formData.radius}
                onChange={handleChange}
                required
              />
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition md:col-span-2 shadow-lg">
              📢 Create Emergency Blood Request
            </button>
          </form>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Blood Requests</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-red-600 text-white text-left">
                  <th className="py-3 px-4">Hospital</th>
                  <th className="py-3 px-4">Blood</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Collected</th>
                  <th className="py-3 px-4">Accepted Donors</th>
                  <th className="py-3 px-4">Eligible Donors</th>
                </tr>
              </thead>

              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No blood requests found. Create one above!
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="border-b hover:bg-red-50 transition">
                      <td className="py-3 px-4 font-semibold text-gray-800">{req.hospital?.hospitalName}</td>
                      <td className="py-3 px-4 font-bold text-red-600">{req.bloodGroup}</td>
                      <td className="py-3 px-4">{req.units}</td>
                      <td className="py-3 px-4">{req.urgency}</td>
                      <td className="py-3 px-4">
                        {req.status === "Active" && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        )}

                        {req.status === "Accepted" && (
                          <div className="flex flex-col items-start gap-1">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Accepted
                            </span>
                            <button
                              onClick={() => completeRequest(req._id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Complete
                            </button>
                          </div>
                        )}

                        {req.status === "Completed" && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {req.collectedUnits} / {req.units}
                      </td>
                      <td className="py-3 px-4">
                        {req.acceptedDonors?.length === 0 ? (
                          "-"
                        ) : (
                          req.acceptedDonors?.map((donor, index) => (
                            <div key={index} className="text-xs mb-1">
                              <p className="font-semibold text-gray-800">✅ {donor.name}</p>
                              <p className="text-gray-500">📞 {donor.phone}</p>
                            </div>
                          ))
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => loadEligibleDonors(req._id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            {mapLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-600 font-medium">Loading donors & map...</span>
              </div>
            ) : !selectedHospital ? (
              <p className="text-gray-500 text-sm">Click "View" on any request to load eligible donors and map.</p>
            ) : (
              <>
                {eligibleDonors.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-5 py-4 mb-6 text-sm font-medium">
                    ⚠️ No eligible donors found in the search radius for this request.
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Found {eligibleDonors.length} Eligible Donor(s)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {eligibleDonors.map((donor) => (
                        <div
                          key={donor._id}
                          className="bg-white rounded-2xl shadow border border-red-100 p-6 hover:shadow-lg transition"
                        >
                          <h3 className="text-xl font-bold text-red-600">{donor.name}</h3>
                          <p className="text-gray-700 mt-1">📍 <strong>{donor.distance} KM</strong> Away</p>
                          <p className="text-gray-700">📞 {donor.phone}</p>
                          <p className="text-gray-700">🩸 <strong>{donor.bloodGroup}</strong></p>
                          <p className="text-gray-700">🏙️ {donor.city}</p>
                          <p className="text-gray-700">🎂 {donor.age} Years</p>
                          <p className="text-gray-700">⚖️ {donor.weight} KG</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-4">
                  <h2 className="text-2xl font-bold mb-5 text-gray-800">🗺️ Hospital & Donor Locations Map</h2>
                  <Map hospital={selectedHospital} donors={eligibleDonors} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}