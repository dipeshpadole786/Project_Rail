// src/pages/pnr.jsx
import { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from "react-leaflet";
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
    const [metroTiming, setMetroTiming] = useState(null);
    const [busTiming, setBusTiming] = useState(null);
    const [error, setError] = useState("");

    // States for nearest metros and buses
    const [nearestUserMetro, setNearestUserMetro] = useState(null);
    const [nearestStationMetro, setNearestStationMetro] = useState(null);
    const [nearestUserBusStop, setNearestUserBusStop] = useState(null);
    const [nearestStationBusStop, setNearestStationBusStop] = useState(null);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ✅ NEW: Function to fetch PNR data from backend
    const fetchPNRData = async (pnrNumber) => {
        try {
            const response = await fetch("http://localhost:5000/api/pnr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pnr: pnrNumber }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to fetch PNR data");
            }

            // Transform MongoDB date to the format expected by frontend
            const trainData = {
                ...result,
                date: new Date(result.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            };

            return trainData;
        } catch (error) {
            console.error("PNR fetch error:", error);
            throw error;
        }
    };

    // Metro API handler
    const handlemetro = async (leaveTime, userMetro) => {
        try {
            if (!leaveTime || !userMetro) {
                alert("Missing metro data");
                return;
            }

            const res = await fetch("http://localhost:5000/api/metro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    leaveTime,
                    nearestUserMetro: userMetro,
                }),
            });

            const data = await res.json();
            console.log("Metro API Response:", data);
            setMetroTiming(data);

        } catch (err) {
            console.error("Metro API Error:", err);
            alert("Failed to fetch metro details");
        }
    };

    // Bus API handler
    const handleBus = async (leaveTime, userBusStop) => {
        try {
            if (!leaveTime || !userBusStop) {
                alert("Missing bus stop data");
                return;
            }

            console.log("Fetching buses for:", leaveTime, userBusStop.name);

            const res = await fetch("http://localhost:5000/api/bus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leaveTime,
                    nearestUserBusStop: userBusStop,
                }),
            });

            const data = await res.json();
            console.log("Bus API Response:", data);
            setBusTiming(data);

        } catch (err) {
            console.error("Bus API Error:", err);
            alert("Failed to fetch bus details");
        }
    };

    // Function to fetch nearest metro station
    const fetchNearestMetro = async (lat, lng) => {
        try {
            const query = `
                [out:json];
                node(around:5000, ${lat}, ${lng})[railway=station][station=subway];
                out center 1;
            `;
            const res = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query,
            });
            const json = await res.json();

            if (json.elements && json.elements.length > 0) {
                const nearest = json.elements[0];
                return {
                    name: nearest.tags.name || "Unnamed Metro Station",
                    coords: [nearest.lat, nearest.lon],
                };
            }
            return null;
        } catch (err) {
            console.error("Overpass API Error:", err);
            return null;
        }
    };

    // Function to fetch nearest bus stop
    const fetchNearestBusStop = async (lat, lng) => {
        try {
            const query = `
                [out:json];
                (
                  node(around:2000, ${lat}, ${lng})[public_transport=stop_position][bus=yes];
                  node(around:2000, ${lat}, ${lng})[highway=bus_stop];
                  node(around:2000, ${lat}, ${lng})[amenity=bus_station];
                );
                out center 1;
            `;
            const res = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query,
            });
            const json = await res.json();

            if (json.elements && json.elements.length > 0) {
                const nearest = json.elements[0];
                return {
                    name: nearest.tags.name || "Unnamed Bus Stop",
                    coords: [nearest.lat, nearest.lon],
                };
            }
            return null;
        } catch (err) {
            console.error("Overpass API Error for Bus:", err);
            return null;
        }
    };

    // Check if metro services are running (before 10 PM)
    const isMetroServiceActive = () => {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour < 22; // Metro closes at 10 PM (22:00)
    };

    const handleCheck = async () => {
        if (!pnr.trim()) {
            alert("Please enter a PNR number");
            return;
        }

        setLoading(true);
        setError("");
        setData(null);

        try {
            // ✅ Fetch data from backend instead of dummy data
            const trainData = await fetchPNRData(pnr);
            setData(trainData);

            // Get user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const userCoords = [pos.coords.latitude, pos.coords.longitude];
                        setUserLocation(userCoords);

                        // Reverse Geocoding
                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userCoords[0]}&lon=${userCoords[1]}`
                            );
                            const json = await res.json();
                            setLocationName(json.display_name);
                        } catch (err) {
                            console.error("Reverse Geocode Error:", err);
                        }

                        // Fetch nearest metros
                        const userMetro = await fetchNearestMetro(
                            userCoords[0],
                            userCoords[1]
                        );
                        setNearestUserMetro(userMetro);

                        const stationMetro = await fetchNearestMetro(
                            trainData.fromCoords[0],
                            trainData.fromCoords[1]
                        );
                        setNearestStationMetro(stationMetro);

                        // Fetch nearest bus stops
                        const userBusStop = await fetchNearestBusStop(
                            userCoords[0],
                            userCoords[1]
                        );
                        setNearestUserBusStop(userBusStop);

                        const stationBusStop = await fetchNearestBusStop(
                            trainData.fromCoords[0],
                            trainData.fromCoords[1]
                        );
                        setNearestStationBusStop(stationBusStop);

                        // Call ORS API for driving route
                        try {
                            const Directions = new Ors.Directions({
                                api_key:
                                    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=",
                            });

                            const response = await Directions.calculate({
                                coordinates: [
                                    [userCoords[1], userCoords[0]],
                                    [trainData.fromCoords[1], trainData.fromCoords[0]],
                                ],
                                profile: "driving-car",
                                format: "geojson",
                            });

                            const coords = response.features[0].geometry.coordinates.map(
                                (c) => [c[1], c[0]]
                            );
                            setRoute(coords);

                            const distKm =
                                response.features[0].properties.segments[0].distance / 1000;
                            const durationMin =
                                response.features[0].properties.segments[0].duration / 60;

                            const scheduledDeparture = new Date(
                                `${trainData.date}T${trainData.departureTime}:00`
                            );

                            const expectedDeparture = new Date(
                                scheduledDeparture.getTime() +
                                (trainData.delayMinutes || 0) * 60000
                            );

                            const reachBy = new Date(expectedDeparture.getTime() - 15 * 60000);
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

                        // Countdown timer
                        if (trainData?.departureTime && trainData?.date) {
                            const scheduledDeparture = new Date(
                                `${trainData.date}T${trainData.departureTime}:00`
                            );
                            const expectedDeparture = new Date(
                                scheduledDeparture.getTime() +
                                (trainData.delayMinutes || 0) * 60000
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
        } catch (error) {
            console.error("Error fetching PNR data:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="pnr-container">
            {/* Header */}
            <div className="pnr-header">
                <h1 className="pnr-title">🚉 PNR Status Checker</h1>
                <p className="pnr-subtitle">Track your train journey in real-time</p>
            </div>

            {/* Search */}
            <div className="pnr-search">
                <div className="search-form">
                    <input
                        type="text"
                        placeholder="Enter your PNR number (e.g., 1000000001)"
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

            {/* Current Time */}
            <div className="current-time">
                <div className="time-label">⏰ Current Time</div>
                <div className="time-value">{currentTime.toLocaleString()}</div>
            </div>

            {/* Train Details */}
            {data && (
                <div className="train-details">
                    <div className="train-header">
                        <div className="train-icon">🚂</div>
                        <div className="train-title">
                            <div className="train-number">Train No: {data.trainNo}</div>
                            <div className="train-name">{data.trainName}</div>
                        </div>
                    </div>

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
                                    ? `${data.delayMinutes} minutes`
                                    : "On Time"}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">🟢 Expected Departure</div>
                            <div className="info-value">
                                {new Date(
                                    new Date(
                                        `${data.date}T${data.departureTime}:00`
                                    ).getTime() + (data.delayMinutes || 0) * 60000
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

                        <div className="info-item">
                            <div className="info-label">🎯 Destination</div>
                            <div className="info-value">{data.to}</div>
                        </div>

                        {/* Nearest Metro Stations */}
                        {nearestUserMetro && (
                            <div className="info-item">
                                <div className="info-label">🚇 Nearest metro station from you</div>
                                <div className="info-value">
                                    {nearestUserMetro.name}
                                </div>
                            </div>
                        )}

                        {nearestStationMetro && (
                            <div className="info-item">
                                <div className="info-label">
                                    🚇 Nearest metro station from railway station
                                </div>
                                <div className="info-value">
                                    {nearestStationMetro.name}
                                </div>
                            </div>
                        )}

                        {/* Nearest Bus Stops */}
                        {nearestUserBusStop && (
                            <div className="info-item">
                                <div className="info-label">🚌 Nearest bus stop from you</div>
                                <div className="info-value">
                                    {nearestUserBusStop.name}
                                </div>
                            </div>
                        )}

                        {nearestStationBusStop && (
                            <div className="info-item">
                                <div className="info-label">
                                    🚌 Nearest bus stop from railway station
                                </div>
                                <div className="info-value">
                                    {nearestStationBusStop.name}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Travel Information with Leave Time */}
                    {/* Travel Information with Leave Time */}
                    {/* Travel Information with Leave Time */}
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

                            {/* Leave Time Information */}
                            <div className="leave-time-box">
                                <div className="leave-time-label">Departure Time</div>
                                <div className="leave-time-value">{travelInfo.leaveBy}</div>
                                <div className="leave-time-note">
                                    Arrive at station by {travelInfo.reachBy} (15 minutes before train departure)
                                </div>

                                {/* Travel Options */}
                                <div className="travel-buttons-container">
                                    {/* Book Taxi/Cab */}
                                    <button
                                        className="travel-btn book-cab-btn"
                                        onClick={() => {
                                            if (!userLocation || !data?.fromCoords) return;
                                            const uberUrl = `https://m.uber.com/ul/?action=setPickup` +
                                                `&pickup[latitude]=${userLocation[0]}&pickup[longitude]=${userLocation[1]}` +
                                                `&dropoff[latitude]=${data.fromCoords[0]}&dropoff[longitude]=${data.fromCoords[1]}` +
                                                `&dropoff[nickname]=${encodeURIComponent(data.from)}`;
                                            window.open(uberUrl, "_blank");
                                        }}
                                        title="Book taxi service to railway station"
                                    >
                                        🚖 Book Taxi
                                    </button>

                                    {/* Metro Services */}
                                    {isMetroServiceActive() ? (
                                        <button
                                            className="travel-btn metro-btn"
                                            onClick={() => {
                                                if (travelInfo?.leaveBy && nearestUserMetro) {
                                                    handlemetro(travelInfo.leaveBy, nearestUserMetro);
                                                } else {
                                                    alert("Metro information not available");
                                                }
                                            }}
                                            title="View metro schedule and timings"
                                        >
                                            🚇 Metro Schedule
                                        </button>
                                    ) : (
                                        <div className="metro-closed">
                                            🚇 Metro services unavailable (after 22:00 hours)
                                        </div>
                                    )}

                                    {/* Bus Services */}
                                    <button
                                        className="travel-btn bus-btn"
                                        onClick={() => {
                                            if (travelInfo?.leaveBy) {
                                                handleBus(travelInfo.leaveBy, { name: "Rajiv Nagar" });
                                            } else {
                                                alert("Bus schedule information not available");
                                            }
                                        }}
                                        title="View bus schedule and timings"
                                    >
                                        🚌 Bus Schedule
                                    </button>
                                </div>

                                {/* Metro Schedule Display */}
                                {metroTiming && (
                                    <div className="metro-card">
                                        <div className="metro-title">
                                            Metro Schedule
                                            <span className="service-badge">LIVE</span>
                                        </div>
                                        <div className="metro-times">
                                            {metroTiming.upcomingDepartures[0] === "No more trains today"
                                                ? <div className="service-error">No more metro services available today</div>
                                                : metroTiming.upcomingDepartures.map((time, index) => (
                                                    <span key={index} className={`metro-time ${index === 0 ? "next-train" : ""}`}>
                                                        {time}
                                                    </span>
                                                ))}
                                        </div>
                                        <div className="metro-note">
                                            Departure Station: {metroTiming.station}
                                        </div>
                                    </div>
                                )}

                                {/* Bus Schedule Display */}
                                {busTiming && (
                                    <div className="bus-card">
                                        <div className="bus-title">
                                            Bus Schedule
                                            <span className="service-badge">LIVE</span>
                                        </div>
                                        <div className="bus-times">
                                            {busTiming.upcomingDepartures[0] === "No more buses today"
                                                ? <div className="service-error">No more bus services available today</div>
                                                : busTiming.upcomingDepartures.map((time, index) => (
                                                    <span key={index} className={`bus-time ${index === 0 ? "next-bus" : ""}`}>
                                                        {time}
                                                    </span>
                                                ))}
                                        </div>
                                        <div className="bus-note">
                                            Departure Stop: {busTiming.station}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Countdown */}
                    {countdown && (
                        <div className="countdown">
                            <div className="countdown-label">
                                ⏳ Time left for Train Departure
                            </div>
                            <div className="countdown-value">{countdown}</div>
                        </div>
                    )}

                    {/* Map */}
                    {userLocation && (
                        <div className="map-container">
                            <MapContainer
                                center={userLocation}
                                zoom={12}
                                style={{ height: "400px", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={userLocation}>
                                    <Popup>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                                            📍 YOUR CURRENT LOCATION
                                        </div>
                                    </Popup>
                                </Marker>
                                <Marker position={data.fromCoords}>
                                    <Popup>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                                            🚉 TRAIN STATION<br />
                                            {data.from}
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Nearest Metros */}
                                {nearestUserMetro && (
                                    <Marker position={nearestUserMetro.coords}>
                                        <Popup>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                                                🚇 NEAREST METRO TO YOU<br />
                                                {nearestUserMetro.name}
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {nearestStationMetro && (
                                    <Marker position={nearestStationMetro.coords}>
                                        <Popup>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                                                🚇 NEAREST METRO TO STATION<br />
                                                {nearestStationMetro.name}
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {/* Nearest Bus Stops */}
                                {nearestUserBusStop && (
                                    <Marker position={nearestUserBusStop.coords}>
                                        <Popup>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                                                🚌 NEAREST BUS STOP TO YOU<br />
                                                {nearestUserBusStop.name}
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {nearestStationBusStop && (
                                    <Marker position={nearestStationBusStop.coords}>
                                        <Popup>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                                                🚌 NEAREST BUS STOP TO STATION<br />
                                                {nearestStationBusStop.name}
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {route && (
                                    <Polyline positions={route} color="#3b82f6" weight={4} />
                                )}
                            </MapContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="train-details error">
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
                        <h3 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>
                            {error.includes("not found") ? "PNR Not Found" : "Error"}
                        </h3>
                        <p style={{ color: "#6b7280" }}>
                            {error}
                        </p>
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: "0.9rem",
                                marginTop: "1rem",
                            }}
                        >
                            Try PNRs: 1000000001 to 1000000010
                        </p>
                    </div>
                </div>
            )}

            {/* No Data */}
            {pnr && !data && !loading && !error && (
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
                            Try PNRs: 1000000001 to 1000000010
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}