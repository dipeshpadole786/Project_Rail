// src/pages/pnr.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PnrStatus() {
    const [pnr, setPnr] = useState("");
    const [data, setData] = useState(null);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    const [route, setRoute] = useState(null);

    // ✅ Get user location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords;

                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await res.json();

                        setLocation({
                            lat: latitude,
                            lon: longitude,
                            address: data.display_name,
                            accuracy: Math.round(accuracy),
                        });
                    } catch (err) {
                        setError("❌ Failed to fetch address");
                    }
                },
                (err) => setError("❌ Location access denied")
            );
        } else {
            setError("❌ Geolocation not supported");
        }
    }, []);

    // ✅ Dummy Train Data (with coordinates for "From" station)
    const stations = {
        "Nagpur Junction, Maharashtra": { lat: 21.1466, lon: 79.0889 },
        "Mumbai CST, Maharashtra": { lat: 18.9402, lon: 72.8356 },
    };

    const dummyData = {
        "1234567890": {
            trainNo: "12139",
            trainName: "Sewagram Express",
            from: "Nagpur Junction, Maharashtra",
            to: "Mumbai CST, Maharashtra",
        },
        "9876543210": {
            trainNo: "12290",
            trainName: "Nagpur Duronto Express",
            from: "Nagpur Junction, Maharashtra",
            to: "Mumbai CST, Maharashtra",
        },
    };

    // ✅ Handle PNR search
    const handleCheck = async () => {
        if (!pnr.trim()) {
            alert("Please enter a PNR number");
            return;
        }

        const trainData = dummyData[pnr];
        if (trainData) {
            setData(trainData);

            if (location) {
                const fromStation = stations[trainData.from];
                if (fromStation) {
                    // route: [user location, train starting station]
                    setRoute([
                        [location.lat, location.lon],
                        [fromStation.lat, fromStation.lon],
                    ]);
                }
            }
        } else {
            setData(null);
            setRoute(null);
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">🚉 PNR Status Checker</h1>

            {/* PNR Input */}
            <input
                type="text"
                placeholder="Enter PNR Number"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="border px-4 py-2 rounded w-64 mb-3"
            />

            <button
                onClick={handleCheck}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Check Status
            </button>

            {/* Train Data */}
            {data ? (
                <div className="mt-6 p-4 border rounded shadow w-80 bg-gray-50">
                    <p><strong>Train No:</strong> {data.trainNo}</p>
                    <p><strong>Train Name:</strong> {data.trainName}</p>
                    <p><strong>From (Auto → User Loc):</strong> {location?.address}</p>
                    <p><strong>To (Train Start):</strong> {data.from}</p>
                </div>
            ) : (
                pnr && (
                    <p className="mt-4 text-red-500">❌ No data found for this PNR</p>
                )
            )}

            {/* Map */}
            {route && (
                <div className="mt-6 w-full max-w-2xl h-96 border rounded shadow">
                    <MapContainer
                        center={route[0]}
                        zoom={6}
                        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />

                        {/* User Location Marker */}
                        <Marker position={route[0]}>
                            <Popup>
                                <b>Your Location</b> <br /> {location?.address}
                            </Popup>
                        </Marker>

                        {/* Train From Station Marker */}
                        <Marker position={route[1]}>
                            <Popup>
                                <b>{data.from}</b>
                            </Popup>
                        </Marker>

                        {/* Polyline showing route */}
                        <Polyline positions={route} color="blue" />
                    </MapContainer>
                </div>
            )}

            {/* Error */}
            {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
    );
}
