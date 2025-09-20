import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from "mongoose";
import MetroSchedule from "./Models/Metro_data.js";
import busSchedule from "./Models/Bus.js";
import Train from "./Models/Train.js";

const app = express();
const PORT = 5000;

// Database connection
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/metroDB");
        console.log("✅ Database connected!");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}

main();

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=";

// Middleware
app.use(cors());
app.use(express.json());

// ✅ PNR Status API - Fixed and Enhanced
app.post("/api/pnr", async (req, res) => {
    try {
        const { pnr } = req.body;

        console.log("📍 PNR API called with:", pnr);

        if (!pnr) {
            return res.status(400).json({ error: "PNR number is required" });
        }

        // Find train by userId (which acts as PNR)
        const trainData = await Train.findOne({ userId: pnr.toString() });

        if (!trainData) {
            console.log("❌ PNR not found:", pnr);
            return res.status(404).json({
                error: "PNR not found in database",
                suggestion: "Try PNR numbers: 1000000001 to 1000000010"
            });
        }

        console.log("✅ Train data found:", trainData.trainName);

        // Format the response data to match what frontend expects
        const responseData = {
            userId: trainData.userId,
            trainNo: trainData.trainNo,
            trainName: trainData.trainName,
            from: trainData.from,
            to: trainData.to,
            fromCoords: trainData.fromCoords,
            departureTime: trainData.departureTime,
            date: trainData.date,
            delayMinutes: trainData.delayMinutes || 0
        };

        res.json(responseData);

    } catch (err) {
        console.error("❌ PNR API Error:", err);
        res.status(500).json({
            error: "Server error while fetching train data",
            details: err.message
        });
    }
});

// ✅ Metro API
app.post("/api/metro", async (req, res) => {
    try {
        const { leaveTime, nearestUserMetro } = req.body;

        console.log("🚇 Metro API called:", { leaveTime, station: nearestUserMetro?.name });

        if (!leaveTime || !nearestUserMetro?.name) {
            return res.status(400).json({
                error: "Missing leaveTime or station name"
            });
        }

        // Convert leaveTime into Date object
        const today = new Date();
        const leaveDate = new Date(`${today.toISOString().split("T")[0]} ${leaveTime}`);

        if (isNaN(leaveDate.getTime())) {
            return res.status(400).json({
                error: "Invalid leaveTime format"
            });
        }

        // Find metro station in DB
        const station = await MetroSchedule.findOne({
            station_name: nearestUserMetro.name,
        });

        if (!station) {
            console.log("❌ Metro station not found:", nearestUserMetro.name);
            return res.status(404).json({
                error: "Station not found in metro schedule",
                requestedStation: nearestUserMetro.name
            });
        }

        // Sort departures just in case DB is unsorted
        const sortedDepartures = [...station.departures].sort((a, b) => {
            const dateA = new Date(`${today.toISOString().split("T")[0]} ${a}`);
            const dateB = new Date(`${today.toISOString().split("T")[0]} ${b}`);
            return dateA - dateB;
        });

        // Find upcoming 3 departures
        let upcomingDepartures = sortedDepartures
            .map((dep) => new Date(`${today.toISOString().split("T")[0]} ${dep}`))
            .filter((depDate) => depDate >= leaveDate)
            .slice(0, 3)
            .map((d) =>
                d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );

        console.log("✅ Metro times found:", upcomingDepartures);

        res.json({
            station: station.station_name,
            leaveTime,
            upcomingDepartures:
                upcomingDepartures.length > 0
                    ? upcomingDepartures
                    : ["No more trains today"],
        });

    } catch (err) {
        console.error("❌ Metro API Error:", err);
        res.status(500).json({
            error: "Server error while fetching metro schedule",
            details: err.message
        });
    }
});

// ✅ Bus API using MongoDB busSchedule model
app.post("/api/bus", async (req, res) => {
    try {
        const { leaveTime, nearestUserBusStop } = req.body;

        console.log("🚌 Bus API called:", { leaveTime, busStop: nearestUserBusStop?.name });

        if (!leaveTime || !nearestUserBusStop?.name) {
            return res.status(400).json({
                error: "Missing leaveTime or bus stop name"
            });
        }

        const today = new Date();
        const leaveDate = new Date(`${today.toISOString().split("T")[0]} ${leaveTime}`);

        if (isNaN(leaveDate.getTime())) {
            return res.status(400).json({
                error: "Invalid leaveTime format"
            });
        }

        // Fetch bus stop from MongoDB
        const busStop = await busSchedule.findOne({
            station_name: nearestUserBusStop.name
        });

        if (!busStop) {
            console.log("❌ Bus stop not found:", nearestUserBusStop.name);
            return res.status(404).json({
                error: "Bus stop not found in database",
                requestedStop: nearestUserBusStop.name
            });
        }

        // Sort departures
        const sortedDepartures = [...busStop.departures].sort((a, b) => {
            return new Date(`${today.toISOString().split("T")[0]} ${a}`) -
                new Date(`${today.toISOString().split("T")[0]} ${b}`);
        });

        // Get next 3 departures
        const upcomingDepartures = sortedDepartures
            .map(dep => new Date(`${today.toISOString().split("T")[0]} ${dep}`))
            .filter(depDate => depDate >= leaveDate)
            .slice(0, 3)
            .map(d => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

        console.log("✅ Bus times found:", upcomingDepartures);

        res.json({
            station: busStop.station_name,
            leaveTime,
            upcomingDepartures: upcomingDepartures.length > 0
                ? upcomingDepartures
                : ["No more buses today"]
        });

    } catch (err) {
        console.error("❌ Bus API Error:", err);
        res.status(500).json({
            error: "Server error while fetching bus schedule",
            details: err.message
        });
    }
});

// ✅ Geocoding helper function for route API
async function geocode(query) {
    try {
        const response = await fetch(
            `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(query)}&boundary.rect.min_lon=78.8&boundary.rect.min_lat=21.0&boundary.rect.max_lon=79.2&boundary.rect.max_lat=21.3`
        );

        const data = await response.json();
        return data.features && data.features.length > 0 ? data.features[0] : null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

// ✅ Route API
app.post("/api/route", async (req, res) => {
    const { from, to } = req.body || {};

    console.log("🗺️ Route API called:", { from, to });

    if (!from || !to) {
        return res.status(400).json({
            error: "Both 'from' and 'to' locations are required."
        });
    }

    try {
        const fromFeat = await geocode(from);
        const toFeat = await geocode(to);

        if (!fromFeat || !toFeat) {
            return res.status(404).json({
                error: "Both locations must be inside Nagpur city."
            });
        }

        const [fromLon, fromLat] = fromFeat.geometry.coordinates;
        const [toLon, toLat] = toFeat.geometry.coordinates;

        console.log("From:", fromFeat.properties.label, "→ To:", toFeat.properties.label);

        const profiles = ["driving-car", "cycling-regular", "foot-walking"];
        const results = {};

        for (const profile of profiles) {
            try {
                const routeRes = await fetch(
                    `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${ORS_API_KEY}&start=${fromLon},${fromLat}&end=${toLon},${toLat}`
                ).then((r) => r.json());

                if (routeRes.error) {
                    console.log(`Error for ${profile}:`, routeRes.error);
                    continue;
                }

                const feat = routeRes?.features?.[0];
                if (!feat) continue;

                const { distance, duration } = feat.properties.summary;
                results[profile] = {
                    distance: (distance / 1000).toFixed(1),
                    duration: (duration / 60).toFixed(1),
                };

                if (profile === "driving-car") {
                    results[profile].coordinates = feat.geometry.coordinates;
                }
            } catch (err) {
                console.error(`Failed for ${profile}:`, err.message);
            }
        }

        if (Object.keys(results).length === 0) {
            return res.status(404).json({
                error: "No routes found inside Nagpur city."
            });
        }

        res.json(results);

    } catch (err) {
        console.error("❌ Route API Error:", err);
        res.status(500).json({
            error: "Failed to fetch routes",
            details: err.message
        });
    }
});

// ✅ Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "PNR Status Backend Server is running!",
        endpoints: {
            pnr: "POST /api/pnr",
            metro: "POST /api/metro",
            bus: "POST /api/bus",
            route: "POST /api/route"
        }
    });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    console.error("🚨 Unhandled error:", err);
    res.status(500).json({
        error: "Internal server error",
        details: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   POST /api/pnr - Get train details by PNR`);
    console.log(`   POST /api/metro - Get metro schedules`);
    console.log(`   POST /api/bus - Get bus schedules`);
    console.log(`   POST /api/route - Get route information`);
});