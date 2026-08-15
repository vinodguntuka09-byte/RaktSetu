import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const donor = JSON.parse(localStorage.getItem("donor") || "null");

  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    if (!donor) return;
    try {
      const res = await api.get("/api/requests/all");

      const filtered = (res.data || []).filter(
        (item) =>
          item.bloodGroup?.toUpperCase() === donor.bloodGroup?.toUpperCase() &&
          item.status === "Active"
      );

      setRequests(filtered);
    } catch (err) {
      console.error("Error loading requests:", err);
    }
  };

  useEffect(() => {
    if (!donor) {
      navigate("/donor-register");
      return;
    }

    loadRequests();

    socket.on("new-request", (newRequest) => {
      console.log("🔥 Real-time Request Event Received:", newRequest);

      if (
        newRequest.bloodGroup?.toUpperCase() === donor.bloodGroup?.toUpperCase()
      ) {
        alert(
          `🚨 Emergency Blood Request Alert!\n\nHospital: ${newRequest.hospitalName || "Emergency Hospital"}\nBlood Group: ${newRequest.bloodGroup}\nUnits: ${newRequest.units}\nUrgency: ${newRequest.urgency}`
        );

        loadRequests();
      }
    });

    return () => {
      socket.off("new-request");
    };
  }, []);

  const acceptDonation = async (requestId) => {
    if (!donor) return;
    try {
      await api.put("/api/requests/accept", {
        requestId,
        donorName: donor.name,
        donorPhone: donor.phone,
      });

      alert("Donation Accepted Successfully ✅ Thank you!");
      loadRequests();
    } catch (err) {
      console.error("Error accepting donation:", err);
      alert(err.response?.data?.message || "Something went wrong accepting donation");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/donor-register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 p-6 md:p-10">
      <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-md border border-red-50 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Welcome, <span className="text-red-600">{donor?.name}</span>
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Blood Group: <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">{donor?.bloodGroup}</span>
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-xl transition shadow"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl mt-8 p-8 border border-red-50">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Matching Blood Requests ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-xl font-semibold text-gray-600">No active requests for your blood group right now.</p>
            <p className="text-sm text-gray-400 mt-2">You will receive live pop-up alerts as soon as a hospital creates a request!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="border border-red-100 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-gradient-to-b from-white to-red-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      🏥 {req.hospital?.hospitalName || "Emergency Request"}
                    </h3>
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                      {req.urgency}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-1">
                    🩸 <strong>Blood Group:</strong> {req.bloodGroup}
                  </p>
                  <p className="text-gray-700 text-sm mb-1">
                    📦 <strong>Units Needed:</strong> {req.units}
                  </p>
                  <p className="text-gray-700 text-sm mb-1">
                    👨‍⚕️ <strong>Doctor:</strong> {req.doctorName}
                  </p>
                  <p className="text-gray-700 text-sm">
                    📞 <strong>Phone:</strong> {req.doctorPhone}
                  </p>
                </div>

                <button
                  onClick={() => acceptDonation(req._id)}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  🤝 Accept Donation Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}