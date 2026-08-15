import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom SVG Icons for Hospital (Red) and Donor (Blue)
// Using base64 encoding for reliable cross-browser / Vite compatibility
const hospitalSvgRaw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42"><path fill="#dc2626" d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/><circle cx="12" cy="12" r="6" fill="#ffffff"/><path fill="#dc2626" d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z"/></svg>`;
const donorSvgRaw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="40"><path fill="#2563eb" d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/><circle cx="12" cy="12" r="5" fill="#ffffff"/></svg>`;

const toBase64 = (svg) => `data:image/svg+xml;base64,${btoa(svg)}`;

const hospitalIcon = L.icon({
  iconUrl: toBase64(hospitalSvgRaw),
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -38],
});

const donorIcon = L.icon({
  iconUrl: toBase64(donorSvgRaw),
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -35],
});

export default function Map({ hospital, donors = [] }) {
  if (!hospital || hospital.latitude == null || hospital.longitude == null) {
    return (
      <div className="bg-gray-100 p-6 rounded-xl text-center text-gray-500">
        Hospital location coordinates unavailable for map view.
      </div>
    );
  }

  const validDonors = donors.filter(
    (d) => d.latitude != null && d.longitude != null
  );

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={[hospital.latitude, hospital.longitude]}
        zoom={12}
        style={{
          height: "400px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hospital Marker */}
        <Marker
          position={[hospital.latitude, hospital.longitude]}
          icon={hospitalIcon}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-red-600 text-base">🏥 {hospital.hospitalName}</h3>
              <p className="text-xs text-gray-600">Requesting Hospital Location</p>
            </div>
          </Popup>
        </Marker>

        {/* Donor Markers */}
        {validDonors.map((donor) => (
          <Marker
            key={donor._id}
            position={[donor.latitude, donor.longitude]}
            icon={donorIcon}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <h3 className="font-bold text-blue-600 text-sm">🩸 {donor.name}</h3>
                <p><b>Blood Group:</b> {donor.bloodGroup}</p>
                <p><b>Distance:</b> {donor.distance} KM</p>
                <p><b>Phone:</b> {donor.phone}</p>
                <p><b>City:</b> {donor.city}</p>
                <p><b>Age / Weight:</b> {donor.age} yrs / {donor.weight} kg</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}