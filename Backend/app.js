import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from "mongoose";
import MetroSchedule from "./Models/Metro_data.js";
import busSchedule from "./Models/Bus.js";

const app = express();
const PORT = 5000;

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/metroDB");
}
main().then(() => {
    console.log("Database connected!");
});

const ORS_API_KEY =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=";

app.use(cors());
app.use(express.json());

// ✅ Metro API
app.post("/api/metro", async (req, res) => {
    try {
        const { leaveTime, nearestUserMetro } = req.body;

        if (!leaveTime || !nearestUserMetro?.name) {
            return res
                .status(400)
                .json({ error: "Missing leaveTime or station name" });
        }

        // Convert leaveTime into Date object
        const today = new Date();
        const leaveDate = new Date(
            `${today.toISOString().split("T")[0]} ${leaveTime}`
        );

        // Find metro station in DB
        const station = await MetroSchedule.findOne({
            station_name: nearestUserMetro.name,
        });

        if (!station) {
            return res
                .status(404)
                .json({ error: "Station not found in metro schedule" });
        }

        // ✅ Sort departures just in case DB is unsorted
        const sortedDepartures = [...station.departures].sort((a, b) => {
            const dateA = new Date(`${today.toISOString().split("T")[0]} ${a}`);
            const dateB = new Date(`${today.toISOString().split("T")[0]} ${b}`);
            return dateA - dateB;
        });

        // ✅ Find upcoming 3 departures
        let upcomingDepartures = sortedDepartures
            .map((dep) => new Date(`${today.toISOString().split("T")[0]} ${dep}`))
            .filter((depDate) => depDate >= leaveDate)
            .slice(0, 3)
            .map((d) =>
                d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );

        res.json({
            station: station.station_name,
            leaveTime,
            upcomingDepartures:
                upcomingDepartures.length > 0
                    ? upcomingDepartures
                    : ["No more trains today"],
        });
    } catch (err) {
        console.error("Metro API Error:", err);
        res.status(500).json({ error: "Server error while fetching metro schedule" });
    }
});

// ✅ NEW Bus API
// ✅ Bus API using MongoDB busSchedule model
app.post("/api/bus", async (req, res) => {
    try {
        const { leaveTime, nearestUserBusStop } = req.body;

        if (!leaveTime || !nearestUserBusStop?.name) {
            return res.status(400).json({ error: "Missing leaveTime or bus stop name" });
        }

        const today = new Date();
        const leaveDate = new Date(`${today.toISOString().split("T")[0]} ${leaveTime}`);
        if (isNaN(leaveDate.getTime())) {
            return res.status(400).json({ error: "Invalid leaveTime format" });
        }

        // ✅ Fetch bus stop from MongoDB
        const busStop = await busSchedule.findOne({
            station_name: nearestUserBusStop.name
        });

        if (!busStop) {
            return res.status(404).json({ error: "Bus stop not found in database" });
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

        res.json({
            station: busStop.station_name,
            leaveTime,
            upcomingDepartures: upcomingDepartures.length > 0 ? upcomingDepartures : ["No more buses today"]
        });

    } catch (err) {
        console.error("Bus API Error:", err);
        res.status(500).json({ error: "Server error while fetching bus schedule" });
    }
});


// ✅ Route API
app.post("/api/route", async (req, res) => {
    const { from, to } = req.body || {};
    if (!from || !to)
        return res
            .status(400)
            .json({ error: "Both 'from' and 'to' are required." });

    try {
        const fromFeat = await geocode(from);
        const toFeat = await geocode(to);

        if (!fromFeat || !toFeat)
            return res
                .status(404)
                .json({ error: "Both locations must be inside Nagpur city." });

        const [fromLon, fromLat] = fromFeat.geometry.coordinates;
        const [toLon, toLat] = toFeat.geometry.coordinates;

        console.log(
            "From:",
            fromFeat.properties.label,
            "→ To:",
            toFeat.properties.label
        );

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

                if (profile === "driving-car")
                    results[profile].coordinates = feat.geometry.coordinates;
            } catch (err) {
                console.error(`Failed for ${profile}:`, err.message);
            }
        }

        if (Object.keys(results).length === 0) {
            return res
                .status(404)
                .json({ error: "No routes found inside Nagpur city." });
        }

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch routes" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));