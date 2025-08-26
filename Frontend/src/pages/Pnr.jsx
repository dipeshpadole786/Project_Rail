// src/pages/pnr.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import Ors from "openrouteservice-js";
import "./Pnr.css"

// Fix Leaflet marker icon issue
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
    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState(null);
    const [travelInfo, setTravelInfo] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [countdown, setCountdown] = useState("");

    // ⏰ Update current time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Dummy train database
    const dummyData = {
        "1234567890": {
            trainNo: "12139",
            trainName: "Sewagram Express",
            from: "Nagpur Junction, Maharashtra",
            to: "Mumbai CST, Maharashtra",
            fromCoords: [21.1501, 79.0882], // Nagpur Junction Lat/Lng
            departureTime: "22:15", // Train departure time (HH:mm format)
            date: "2025-08-21", // Example train date
        },
    };

    const handleCheck = async () => {
        if (!pnr.trim()) {
            alert("Please enter a PNR number");
            return;
        }

        const trainData = dummyData[pnr] || null;
        setData(trainData);

        if (!trainData) return;

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const userCoords = [pos.coords.latitude, pos.coords.longitude];
                    setUserLocation(userCoords);

                    // Reverse Geocoding (convert lat/lng -> location name)
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userCoords[0]}&lon=${userCoords[1]}`
                        );
                        const json = await res.json();
                        setLocationName(json.display_name);
                    } catch (err) {
                        console.error("Reverse Geocode Error:", err);
                    }

                    // Call OpenRouteService API
                    try {
                        const Directions = new Ors.Directions({
                            api_key: "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=", // 🔑 put your ORS key
                        });

                        const response = await Directions.calculate({
                            coordinates: [
                                [userCoords[1], userCoords[0]], // [lng, lat]
                                [trainData.fromCoords[1], trainData.fromCoords[0]],
                            ],
                            profile: "driving-car",
                            format: "geojson",
                        });

                        // Get route geometry (polyline)
                        const coords = response.features[0].geometry.coordinates.map((c) => [
                            c[1],
                            c[0],
                        ]);
                        setRoute(coords);

                        // Distance & duration
                        const distKm =
                            response.features[0].properties.segments[0].distance / 1000;
                        const durationMin =
                            response.features[0].properties.segments[0].duration / 60;
                        setTravelInfo({
                            distance: distKm.toFixed(2),
                            duration: durationMin.toFixed(1),
                        });
                    } catch (err) {
                        console.error("ORS Error:", err);
                    }

                    // Calculate countdown until train departure
                    if (trainData?.departureTime && trainData?.date) {
                        const departureDateTime = new Date(
                            `${trainData.date}T${trainData.departureTime}:00`
                        );
                        const interval = setInterval(() => {
                            const now = new Date();
                            const diff = departureDateTime - now;

                            if (diff <= 0) {
                                setCountdown("🚉 Train already departed");
                                clearInterval(interval);
                            } else {
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                                setCountdown(`${hours}h ${mins}m ${secs}s left`);
                            }
                        }, 1000);
                    }
                },
                (err) => {
                    console.error(err);
                    alert("Unable to fetch your location");
                }
            );
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">🚉 PNR Status Checker</h1>

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

            {/* Show current time */}
            <p className="mt-3 text-gray-600">
                ⏰ Current Time: <strong>{currentTime.toLocaleString()}</strong>
            </p>

            {data && (
                <div className="mt-6 p-4 border rounded shadow w-full max-w-lg bg-gray-50">
                    <p>
                        <strong>Train No:</strong> {data.trainNo}
                    </p>
                    <p>
                        <strong>Train Name:</strong> {data.trainName}
                    </p>
                    <p>
                        <strong>Date:</strong> {data.date}
                    </p>
                    <p>
                        <strong>Departure Time:</strong> {data.departureTime}
                    </p>
                    <p>
                        <strong>From (Your Location):</strong>{" "}
                        {locationName || "Fetching..."}
                    </p>
                    <p>
                        <strong>To (Train Start):</strong> {data.from}
                    </p>

                    {travelInfo && (
                        <p className="mt-2">
                            📏 Distance: <strong>{travelInfo.distance} km</strong> | ⏱️ Time:{" "}
                            <strong>{travelInfo.duration} min</strong>
                        </p>
                    )}

                    {countdown && (
                        <p className="mt-2 text-red-600">
                            ⏳ Time left for Train Departure: <strong>{countdown}</strong>
                        </p>
                    )}

                    {userLocation && (
                        <MapContainer
                            center={userLocation}
                            zoom={12}
                            style={{ height: "400px", width: "100%", marginTop: "1rem" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={userLocation}>
                                <Popup>📍 Your Location</Popup>
                            </Marker>
                            <Marker position={data.fromCoords}>
                                <Popup>🚉 {data.from}</Popup>
                            </Marker>
                            {route && <Polyline positions={route} color="blue" />}
                        </MapContainer>
                    )}
                </div>
            )}
        </div>
    );
}
