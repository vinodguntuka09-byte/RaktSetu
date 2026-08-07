import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

export default function DonorDashboard() {
  const navigate = useNavigate();

  const donor = JSON.parse(localStorage.getItem("donor"));

  const [requests, setRequests] = useState([]);

  useEffect(() => {
  loadRequests();

  socket.on("new-request", (newRequest) => {

    console.log("🔥 Socket Event Received");
    console.log(newRequest);

    if (
      newRequest.bloodGroup === donor.bloodGroup
    ) {
      alert(
        `🚨 New Blood Request!\n\nBlood Group: ${newRequest.bloodGroup}\nUnits: ${newRequest.units}\nUrgency: ${newRequest.urgency}`
      );

      loadRequests();
    }
  });

  return () => {
    socket.off("new-request");
  };
}, []);

  const loadRequests = async () => {
    try {
      const res = await axios.get(
        "https://raktsetu-d1bz.onrender.com/api/requests/all"
      );

      const filtered = res.data.filter(
        (item) =>
          item.bloodGroup === donor.bloodGroup &&
          item.status === "Active"
      );

      setRequests(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const acceptDonation = async (requestId) => {
    try {
      await axios.put(
        "https://raktsetu-d1bz.onrender.com/api/requests/accept",
        {
          requestId,
          donorName: donor.name,
          donorPhone: donor.phone,
        }
      );

      alert("Donation Accepted ✅");

      loadRequests();
    } catch (err) {
      console.log(err);

      alert("Something went wrong");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between">

        <div>

          <h1 className="text-4xl font-bold">

            Welcome

            <span className="text-red-600">

              {" "}
              {donor.name}

            </span>

          </h1>

          <p className="mt-2">

            Blood Group : {donor.bloodGroup}

          </p>

        </div>

        <button
          onClick={logout}
          className="bg-white-600 text-Black   px-5 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

      <div className="bg-white rounded-xl shadow mt-10 p-8">

        <h2 className="text-3xl font-bold mb-6">

          Matching Blood Requests

        </h2>

        {requests.length === 0 ? (
          <h2>No Matching Requests</h2>
        ) : (
          requests.map((req) => (
            <div
              key={req._id}
              className="border rounded-lg p-5 mb-5"
            >
              <h2 className="text-xl font-bold">

                {req.hospital?.hospitalName}

              </h2>

              <p>Blood Group : {req.bloodGroup}</p>

              <p>Units : {req.units}</p>

              <p>Doctor : {req.doctorName}</p>

              <p>Phone : {req.doctorPhone}</p>

              <p>Urgency : {req.urgency}</p>

              <button
                onClick={() => acceptDonation(req._id)}
                className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Accept Donation
              </button>
            </div>
          ))
        )}

      </div>

    </div>
  );
}