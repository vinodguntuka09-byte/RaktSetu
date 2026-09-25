import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import socket from "../socket";

export default function AcceptedDonorsDashboard() {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAcceptedDonors = async () => {
        try {
            const res = await api.get(
                `/api/requests/accepted/${requestId}`
            );

            setData(res.data);
        } catch (err) {
            console.error(
                "Error loading accepted donors:",
                err
            );

            if (err.response?.status === 401) {
                alert(
                    "Session expired. Please log in again."
                );

                navigate("/hospital-login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAcceptedDonors();

        const handleDonorAccepted = (payload) => {
            if (
                String(payload?.requestId) ===
                String(requestId)
            ) {
                loadAcceptedDonors();
            }
        };

        socket.on(
            "donor-accepted",
            handleDonorAccepted
        );

        return () => {
            socket.off(
                "donor-accepted",
                handleDonorAccepted
            );
        };
    }, [requestId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">
                    Loading accepted donors...
                </p>
            </div>
        );
    }

    const acceptedDonors =
        data?.acceptedDonors || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 p-6 md:p-10">
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                        🚑 Accepted Donors
                    </h1>

                    <p className="text-gray-600 mt-2">
                        {data?.request?.hospital
                            ?.hospitalName}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-xl font-semibold"
                >
                    ← Hospital Dashboard
                </button>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">
                            Blood Group
                        </p>

                        <p className="text-2xl font-bold text-red-600">
                            {data?.request?.bloodGroup}
                        </p>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">
                            Required Units
                        </p>

                        <p className="text-2xl font-bold text-yellow-700">
                            {data?.request?.units}
                        </p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">
                            Accepted
                        </p>

                        <p className="text-2xl font-bold text-green-700">
                            {acceptedDonors.length}
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <p className="text-xl font-bold text-blue-700">
                            {data?.request?.status}
                        </p>
                    </div>
                </div>

                {acceptedDonors.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <div className="text-5xl mb-4">
                            ⏳
                        </div>

                        <h2 className="text-2xl font-bold text-gray-700">
                            No Donor Has Accepted Yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Accepted responses will appear here
                            automatically.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {acceptedDonors.map(
                            (donor, index) => {
                                const hasLocation =
                                    donor.latitude != null &&
                                    donor.longitude != null;

                                const mapLink =
                                    hasLocation
                                        ? `https://www.google.com/maps?q=${donor.latitude},${donor.longitude}`
                                        : null;

                                return (
                                    <div
                                        key={
                                            donor.responseId ||
                                            index
                                        }
                                        className="border border-green-200 bg-green-50/40 rounded-2xl p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-green-700">
                                                    ✅ Accepted Response #
                                                    {index + 1}
                                                </h2>

                                                <p className="mt-3 text-gray-700">
                                                    ⏱️{" "}
                                                    <strong>
                                                        Accepted At:
                                                    </strong>{" "}
                                                    {donor.acceptedAt
                                                        ? new Date(
                                                            donor.acceptedAt
                                                        ).toLocaleString()
                                                        : "-"}
                                                </p>

                                                <p className="mt-1 text-gray-700">
                                                    📍{" "}
                                                    <strong>
                                                        Location:
                                                    </strong>{" "}
                                                    {hasLocation
                                                        ? "Received"
                                                        : "Not available"}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-start lg:items-end gap-3">
                                                <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                                                    DONATION ACCEPTED
                                                </span>

                                                {hasLocation ? (
                                                    <>
                                                        <p className="text-xs text-gray-500">
                                                            {Number(
                                                                donor.latitude
                                                            ).toFixed(5)}
                                                            ,{" "}
                                                            {Number(
                                                                donor.longitude
                                                            ).toFixed(5)}
                                                        </p>

                                                        <a
                                                            href={mapLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold"
                                                        >
                                                            📍 Open Location
                                                        </a>
                                                    </>
                                                ) : (
                                                    <p className="text-red-600 font-semibold">
                                                        ⚠️ Location not received
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}