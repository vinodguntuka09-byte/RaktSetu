import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔴 Hospital Icon
const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔵 Donor Icon
const donorIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ hospital, donors }) {
  if (!hospital) return null;

  return (
    <MapContainer
      center={[hospital.latitude, hospital.longitude]}
      zoom={14}
      style={{
        height: "350px",
        width: "50%",
        margin: "0 auto",
        borderRadius: "15px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Hospital Marker */}
      <Marker
        position={[hospital.latitude, hospital.longitude]}
        icon={hospitalIcon}
      >
        <Popup>
          <div>
            <h3><b>🏥 {hospital.hospitalName}</b></h3>
            <p>This is the requesting hospital.</p>
          </div>
        </Popup>
      </Marker>

      {/* Donor Markers */}
      {donors.map((donor) => (
        <Marker
          key={donor._id}
          position={[donor.latitude, donor.longitude]}
          icon={donorIcon}
        >
          <Popup>
            <div>
              <h3><b>🩸 {donor.name}</b></h3>

              <p><b>Blood Group:</b> {donor.bloodGroup}</p>

              <p><b>Distance:</b> {donor.distance} KM</p>

              <p><b>Phone:</b> {donor.phone}</p>

              <p><b>City:</b> {donor.city}</p>

              <p><b>Age:</b> {donor.age} Years</p>

              <p><b>Weight:</b> {donor.weight} KG</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}