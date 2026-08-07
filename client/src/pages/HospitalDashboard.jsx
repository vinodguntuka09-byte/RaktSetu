import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import axios from "axios";

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const hospital = JSON.parse(localStorage.getItem("hospital"));

  const [requests, setRequests] = useState([]);

  const [eligibleDonors, setEligibleDonors] = useState([]);

  const [selectedHospital, setSelectedHospital] = useState(null);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: "",
    urgency: "Critical",
    doctorName: "",
    doctorPhone: "",
    radius: "",
  });

  const logout = () => {
  localStorage.clear();
  navigate("/");
};

const loadEligibleDonors = async (requestId) => {

    

  try {
    const res = await axios.get(
      `http://localhost:5000/api/requests/eligible/${requestId}`
    );

      //alert(JSON.stringify(res.data.donors));

    setEligibleDonors(res.data.donors);
    setSelectedHospital(res.data.hospital);

    //alert(`${res.data.totalEligible} Eligible Donor(s) Found`);
  } catch (err) {
    console.log(err);
    alert("Failed to load eligible donors");
  }
};


const completeRequest = async (requestId) => {
  try {
    await axios.put(
      "http://localhost:5000/api/requests/complete",
      {
        requestId,
      }
    );

    alert("Request Completed ✅");

    loadRequests();

  } catch (err) {
    console.log(err);
    alert("Failed to Complete Request");
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/all"
      );

      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  loadRequests();

  const interval = setInterval(() => {
    loadRequests();
  }, 3000);

  return () => clearInterval(interval);  
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/requests/create",
        {
          hospital: hospital._id,
          ...formData,
        }
      );

      alert("Blood Request Created ✅");

      setFormData({
        bloodGroup: "",
        units: "",
        urgency: "Critical",
        doctorName: "",
        doctorPhone: "",
        radius: "",
      });

      loadRequests();
    } catch (err) {
  console.log(err.response?.data);
  alert(err.response?.data?.message || "Server Error");
}
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-gray-100">

      <div className="w-full bg-red-600 text-white shadow-lg px-10 py-6 flex justify-between items-center">

        <h1 className="text-4xl font-extrabold tracking-wide">
          Welcome
          <span className="text-yellow-300">
            {" "}
            {hospital?.hospitalName}
          </span>
        </h1>

        <p className="text-red-100 mt-1">
          Hospital Dashboard
          </p>

            <button
  onClick={logout}
  className="text-white px-7 py-2 transition-all duration-300 ml-10"
>
  Logout
</button>




      </div>

      <div className="w-full mt-8 bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Create Blood Request
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >
          <input
            className="border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            name="bloodGroup"
            placeholder="Blood Group"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          />

          <input
            className="border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            name="units"
            placeholder="Units"
            type="number"
            value={formData.units}
            onChange={handleChange}
            required
          />

          <select
            className="border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
          >
            <option>Critical</option>
            <option>Within 24 hrs</option>
            <option>Within a week</option>
          </select>

          <input
            className="border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            name="doctorName"
            placeholder="Doctor Name"
            value={formData.doctorName}
            onChange={handleChange}
            required
          />

          <input
            className="border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            name="doctorPhone"
            placeholder="Doctor Phone"
            value={formData.doctorPhone}
            onChange={handleChange}
            required
          />

          <input
            className="border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            name="radius"
            placeholder="Radius (KM)"
            type="number"
            value={formData.radius}
            onChange={handleChange}
            required
          />

          <button
            className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold text-lg transition col-span-2"
          >
            Create Request
          </button>
        </form>
      </div>

      <div className="w-full mt-8 bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          Blood Requests
        </h2>

        <table className="w-full border-collapse overflow-hidden rounded-xl">

          <thead>

            <tr className="bg-red-600 text-white">

              <th className="py-3">Hospital</th>
              <th>Blood</th>
<th>Units</th>
<th>Urgency</th>
<th>Status</th>
<th>Collected</th>
<th>Accepted Donors</th>
<th>Eligible Donors</th>

            </tr>

          </thead>

              <tbody>

  {requests.map((req) => (

    <tr
      key={req._id}
      className="text-center border-b hover:bg-red-50 transition"
    >

      <td className="py-3">
        {req.hospital?.hospitalName}
      </td>

      <td>{req.bloodGroup}</td>

      <td>{req.units}</td>

      <td>{req.urgency}</td>

      <td>

        {req.status === "Active" && (
  <span className="text-yellow-600 font-semibold">
    Active
  </span>
)}

{req.status === "Accepted" && (
  <div className="flex flex-col items-center gap-2">

    <span className="text-green-600 font-semibold">
      Accepted
    </span>

    <button
      onClick={() => completeRequest(req._id)}
      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
    >
      Complete
    </button>

  </div>
)}

{req.status === "Completed" && (
  <span className="text-blue-600 font-semibold">
    Completed
  </span>
)}

      </td>

      <td>
  {req.collectedUnits} / {req.units}
</td>

<td>
  {req.acceptedDonors.length === 0 ? (
    "-"
  ) : (
    req.acceptedDonors.map((donor, index) => (
      <div key={index} className="mb-2">
        <p>✅ {donor.name}</p>
        <p>📞 {donor.phone}</p>
      </div>
    ))
  )}
</td>

      <td>

  <button
    onClick={() => loadEligibleDonors(req._id)}
    className=" text-gray-800 px-4 py-2  font-semibold  transition-all duration-300"
  >
    View
  </button>

</td>

    </tr>

  ))}

</tbody>

        </table>

        <div className="mt-8">

  {eligibleDonors.length === 0 ? (

    <p className="text-gray-500">
      Click "View" to load eligible donors.
    </p>

  ) : (

    <>
      <div className="grid grid-cols-2 gap-4">

        {eligibleDonors.map((donor) => (

          <div
            key={donor._id}
            className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-bold text-red-600">
              {donor.name}
            </h3>

            <p>📍 {donor.distance} KM Away</p>

            <p>📞 {donor.phone}</p>

            <p>🩸 {donor.bloodGroup}</p>

            <p>📍 {donor.city}</p>

            <p>🎂 {donor.age} Years</p>

            <p>⚖️ {donor.weight} KG</p>

          </div>

        ))}

      </div>

      {selectedHospital && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">
            Hospital & Donor Locations
          </h2>

          <Map
            hospital={selectedHospital}
            donors={eligibleDonors}
          />
        </div>
      )}

    </>

  )}

</div>


      </div>

    </div>
  );
}