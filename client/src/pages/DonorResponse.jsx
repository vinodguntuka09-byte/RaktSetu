import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function DonorResponse() {
    const { requestId } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const getResponseId = () => {
        const storageKey =
            `raktsetu_response_${requestId}`;

        let responseId =
            localStorage.getItem(storageKey);

        if (!responseId) {
            responseId =
                window.crypto?.randomUUID
                    ? window.crypto.randomUUID()
                    : `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2)}`;

            localStorage.setItem(
                storageKey,
                responseId
            );
        }

        return responseId;
    };

    useEffect(() => {
        const loadRequest = async () => {
            try {
                const res = await api.get(
                    `/api/requests/public/${requestId}`
                );

                setData(res.data);
            } catch (err) {
                console.error(
                    "Error loading emergency request:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load this emergency request."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRequest();
    }, [requestId]);

    const handleAccept = () => {
        if (!navigator.geolocation) {
            setError(
                "Location services are not supported on this device."
            );
            return;
        }

        setProcessing(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const responseId =
                        getResponseId();

                    await api.post(
                        "/api/requests/respond",
                        {
                            requestId,
                            responseId,
                            action: "accept",
                            latitude:
                                position.coords.latitude,
                            longitude:
                                position.coords.longitude,
                        }
                    );

                    setResult("Accepted");
                } catch (err) {
                    console.error(
                        "Error accepting request:",
                        err
                    );

                    setError(
                        err.response?.data?.message ||
                        "Unable to accept this request."
                    );
                } finally {
                    setProcessing(false);
                }
            },
            (locationError) => {
                console.error(
                    "Location error:",
                    locationError
                );

                setProcessing(false);

                setError(
                    "📍 Location permission is required to accept this emergency request."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleDecline = async () => {
        try {
            setProcessing(true);
            setError("");

            const responseId =
                getResponseId();

            await api.post(
                "/api/requests/respond",
                {
                    requestId,
                    responseId,
                    action: "decline",
                }
            );

            setResult("Declined");
        } catch (err) {
            console.error(
                "Error declining request:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to record your response."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <p className="text-lg font-semibold text-gray-700">
                    Loading emergency request...
                </p>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">
                        ⚠️
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Request Unavailable
                    </h1>

                    <p className="text-red-600 mt-4">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (result === "Accepted") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">
                        ✅
                    </div>

                    <h1 className="text-3xl font-extrabold text-green-700">
                        Donation Accepted
                    </h1>

                    <p className="mt-4 text-gray-600">
                        Thank you for responding to this
                        emergency request.
                    </p>

                    <p className="mt-2 text-gray-600">
                        📍 Your location has been shared
                        with the hospital.
                    </p>
                </div>
            </div>
        );
    }

    if (result === "Declined") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">
                        ❌
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-700">
                        Response Recorded
                    </h1>

                    <p className="mt-4 text-gray-600">
                        Thank you for responding to this
                        emergency request.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-red-100">

                <div className="text-center">
                    <div className="text-5xl mb-3">
                        🚨
                    </div>

                    <h1 className="text-3xl font-extrabold text-red-600">
                        RaktSetu Emergency Request
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Please respond to this emergency
                        blood request.
                    </p>
                </div>

                <div className="mt-8 bg-red-50 rounded-2xl p-5 space-y-3">
                    <p>
                        🩸 <strong>Blood Group:</strong>{" "}
                        {data?.request?.bloodGroup}
                    </p>

                    <p>
                        📦 <strong>Units Required:</strong>{" "}
                        {data?.request?.units}
                    </p>

                    <p>
                        ⚠️ <strong>Urgency:</strong>{" "}
                        {data?.request?.urgency}
                    </p>

                    <p>
                        🏥 <strong>Hospital:</strong>{" "}
                        {data?.request?.hospital
                            ?.hospitalName}
                    </p>

                    <p>
                        📍 <strong>Address:</strong>{" "}
                        {data?.request?.hospital
                            ?.address}
                    </p>
                </div>

                {error && (
                    <div className="mt-5 bg-red-100 text-red-700 border border-red-200 rounded-xl p-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-8">
                    <p className="text-center text-lg font-bold text-gray-800 mb-5">
                        Are you willing to donate?
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={processing}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-4 rounded-xl shadow-lg transition"
                        >
                            {processing
                                ? "Getting Location..."
                                : "✅ ACCEPT DONATION"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDecline}
                            disabled={processing}
                            className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition"
                        >
                            ❌ DECLINE
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    RaktSetu Emergency Services
                </p>
            </div>
        </div>
    );
}