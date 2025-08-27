// src/pages/pnr.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import Ors from "openrouteservice-js";
import "./Pnr.css";

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
    const [loading, setLoading] = useState(false);

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
            departureTime: "09:15", // Train departure time (HH:mm format)
            date: "2025-08-26", // Example train date
            delayMinutes: 30, // ⏳ Train delayed 3 hours
        },
    };

    const handleCheck = async () => {
        if (!pnr.trim()) {
            alert("Please enter a PNR number");
            return;
        }

        setLoading(true);
        const trainData = dummyData[pnr] || null;
        setData(trainData);

        if (!trainData) {
            setLoading(false);
            return;
        }

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
                            api_key:
                                "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=",
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

                        // ✅ Calculate Leave Time
                        const scheduledDeparture = new Date(
                            `${trainData.date}T${trainData.departureTime}:00`
                        );

                        const expectedDeparture = new Date(
                            scheduledDeparture.getTime() + (trainData.delayMinutes || 0) * 60000
                        );

                        // Reach 15 minutes early
                        const reachBy = new Date(expectedDeparture.getTime() - 15 * 60000);

                        // Subtract travel time (duration in minutes)
                        const leaveBy = new Date(
                            reachBy.getTime() - durationMin * 60000
                        );

                        setTravelInfo({
                            distance: distKm.toFixed(2),
                            duration: durationMin.toFixed(1),
                            leaveBy: leaveBy.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            reachBy: reachBy.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        });
                    } catch (err) {
                        console.error("ORS Error:", err);
                    }

                    // ✅ Countdown
                    if (trainData?.departureTime && trainData?.date) {
                        const scheduledDeparture = new Date(
                            `${trainData.date}T${trainData.departureTime}:00`
                        );

                        const expectedDeparture = new Date(
                            scheduledDeparture.getTime() + (trainData.delayMinutes || 0) * 60000
                        );

                        const interval = setInterval(() => {
                            const now = new Date();
                            const diff = expectedDeparture - now;

                            if (diff <= 0) {
                                setCountdown("🚂 Train already departed");
                                clearInterval(interval);
                            } else {
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const mins = Math.floor(
                                    (diff % (1000 * 60 * 60)) / (1000 * 60)
                                );
                                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                                setCountdown(`${hours}h ${mins}m ${secs}s`);
                            }
                        }, 1000);
                    }

                    setLoading(false);
                },
                (err) => {
                    console.error(err);
                    alert("Unable to fetch your location");
                    setLoading(false);
                }
            );
        }
    };

    return (
        <div className="pnr-container">
            {/* Header Section */}
            <div className="pnr-header">
                <h1 className="pnr-title">🚉 PNR Status Checker</h1>
                <p className="pnr-subtitle">Track your train journey in real-time</p>
            </div>

            {/* Search Section */}
            <div className="pnr-search">
                <div className="search-form">
                    <input
                        type="text"
                        placeholder="Enter your PNR number"
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value)}
                        className="pnr-input"
                        maxLength="10"
                    />
                    <button
                        onClick={handleCheck}
                        className="check-button"
                        disabled={loading}
                    >
                        {loading ? <span className="loading"></span> : "Check Status"}
                    </button>
                </div>
            </div>

            {/* Current Time Display */}
            <div className="current-time">
                <div className="time-label">⏰ Current Time</div>
                <div className="time-value">{currentTime.toLocaleString()}</div>
            </div>

            {/* Train Details */}
            {data && (
                <div className="train-details">
                    {/* Train Header */}
                    <div className="train-header">
                        <div className="train-icon">🚂</div>
                        <div className="train-title">
                            <div className="train-number">Train No: {data.trainNo}</div>
                            <div className="train-name">{data.trainName}</div>
                        </div>
                    </div>

                    {/* Train Info Grid */}
                    <div className="train-info-grid">
                        <div className="info-item">
                            <div className="info-label">📅 Travel Date</div>
                            <div className="info-value">{data.date}</div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">🕐 Scheduled Departure</div>
                            <div className="info-value">{data.departureTime}</div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">⏳ Delay</div>
                            <div className="info-value">
                                {data.delayMinutes > 0
                                    ? `${data.delayMinutes / 60} hours`
                                    : "On Time"}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">🟢 Expected Departure</div>
                            <div className="info-value">
                                {new Date(
                                    new Date(`${data.date}T${data.departureTime}:00`).getTime() +
                                    (data.delayMinutes || 0) * 60000
                                ).toLocaleString()}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">📍 Your Location</div>
                            <div className="info-value">
                                {locationName || "Fetching location..."}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">🚉 Train Station</div>
                            <div className="info-value">{data.from}</div>
                        </div>
                    </div>

                    {/* Travel Information */}
                    {travelInfo && (
                        <div className="travel-info">
                            <div className="travel-info-content">
                                <div className="travel-metric">
                                    <div className="travel-metric-value">
                                        {travelInfo.distance} km
                                    </div>
                                    <div className="travel-metric-label">Distance</div>
                                </div>
                                <div className="travel-metric">
                                    <div className="travel-metric-value">
                                        {travelInfo.duration} min
                                    </div>
                                    <div className="travel-metric-label">Travel Time</div>
                                </div>
                            </div>

                            {/* ✅ Leave Time Box */}
                            <div className="leave-time-box">
                                <div className="leave-time-label">🕒 Leave By</div>
                                <div className="leave-time-value">{travelInfo.leaveBy}</div>
                                <div className="leave-time-note">
                                    (to reach station by {travelInfo.reachBy}, 15 min before train departs)
                                </div>

                                {/* 🚖 Book Cab */}
                                <button
                                    className="book-cab-btn"
                                    onClick={() => {
                                        if (!userLocation || !data?.fromCoords) return;
                                        const uberUrl = `https://m.uber.com/ul/?action=setPickup` +
                                            `&pickup[latitude]=${userLocation[0]}&pickup[longitude]=${userLocation[1]}` +
                                            `&dropoff[latitude]=${data.fromCoords[0]}&dropoff[longitude]=${data.fromCoords[1]}` +
                                            `&dropoff[nickname]=${encodeURIComponent(data.from)}`;
                                        window.open(uberUrl, "_blank");
                                    }}
                                >
                                    🚖 Book Cab
                                </button>

                                {/* 🚇 See Metro */}
                                <button
                                    className="metro-btn"
                                    onClick={() => {
                                        if (!data?.from || !data?.to) return;
                                        const metroUrl = `comgooglemaps://?saddr=${encodeURIComponent(
                                            data.from
                                        )}&daddr=${encodeURIComponent(data.to)}&directionsmode=transit`;
                                        window.location.href = metroUrl;
                                    }}
                                >
                                    🚇 See Metro
                                </button>

                                {/* 🚌 See Buses */}
                                <button
                                    className="bus-btn"
                                    onClick={() => {
                                        if (!data?.from || !data?.to) return;
                                        const busUrl = `comgooglemaps://?saddr=${encodeURIComponent(
                                            data.from
                                        )}&daddr=${encodeURIComponent(data.to)}&directionsmode=transit`;
                                        window.location.href = busUrl;
                                    }}
                                >
                                    🚌 See Buses
                                </button>
                            </div>
                        </div>
                    )}




                    {/* Countdown Timer */}
                    {countdown && (
                        <div className="countdown">
                            <div className="countdown-label">
                                ⏳ Time left for Train Departure
                            </div>
                            <div className="countdown-value">{countdown}</div>
                        </div>
                    )}

                    {/* Map Container */}
                    {userLocation && (
                        <div className="map-container">
                            <MapContainer
                                center={userLocation}
                                zoom={12}
                                style={{ height: "400px", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={userLocation}>
                                    <Popup>📍 Your Current Location</Popup>
                                </Marker>
                                <Marker position={data.fromCoords}>
                                    <Popup>🚉 {data.from}</Popup>
                                </Marker>
                                {route && (
                                    <Polyline positions={route} color="#3b82f6" weight={4} />
                                )}
                            </MapContainer>
                        </div>
                    )}
                </div>
            )}

            {/* No Data Found */}
            {pnr && !data && !loading && (
                <div className="train-details error">
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
                        <h3 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>
                            PNR Not Found
                        </h3>
                        <p style={{ color: "#6b7280" }}>
                            Please check your PNR number and try again.
                        </p>
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: "0.9rem",
                                marginTop: "1rem",
                            }}
                        >
                            Try: 1234567890 (Demo PNR)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
