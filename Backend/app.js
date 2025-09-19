import express from "express";
import cors from "cors";
import fetch from "node-fetch";

import mongoose from "mongoose";
import MetroSchedule from "./Models/Metro_data.js";

const app = express();
const PORT = 5000;
// import MetroSchedule from "./Models/Metro_data";


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/metroDB");
}
main().then(() => {
    console.log(
        "Database connected!"
    )
})
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=";

app.use(cors());
app.use(express.json());

// Nagpur city bounding box
const NAGPUR_CITY_BBOX = "78.95,21.05,79.2,21.25";

app.post("/api/metro", async (req, res) => {
    try {
        const { leaveTime, nearestUserMetro } = req.body;

        if (!leaveTime || !nearestUserMetro?.name) {
            return res.status(400).json({ error: "Missing leaveTime or station name" });
        }

        // ✅ Convert leaveTime into Date object
        const today = new Date();
        const leaveDate = new Date(
            `${today.toISOString().split("T")[0]} ${leaveTime}`
        );

        // ✅ Find metro station in DB
        const station = await MetroSchedule.findOne({
            station_name: nearestUserMetro.name,
        });

        if (!station) {
            return res.status(404).json({ error: "Station not found in metro schedule" });
        }

        // ✅ Find nearest departure
        let nearestDeparture = null;
        for (const dep of station.departures) {
            const depDate = new Date(`${today.toISOString().split("T")[0]} ${dep}`);

            if (depDate >= leaveDate) {
                nearestDeparture = dep;
                break;
            }
        }

        res.json({
            station: station.station_name,
            leaveTime,
            nearestDeparture: nearestDeparture || "No more trains today",
        });

    } catch (err) {
        console.error("Metro API Error:", err);
        res.status(500).json({ error: "Server error while fetching metro schedule" });
    }
});



app.post("/api/route", async (req, res) => {
    const { from, to } = req.body || {};
    if (!from || !to) return res.status(400).json({ error: "Both 'from' and 'to' are required." });

    try {
        const fromFeat = await geocode(from);
        const toFeat = await geocode(to);

        if (!fromFeat || !toFeat)
            return res.status(404).json({ error: "Both locations must be inside Nagpur city." });

        const [fromLon, fromLat] = fromFeat.geometry.coordinates;
        const [toLon, toLat] = toFeat.geometry.coordinates;

        console.log("From:", fromFeat.properties.label, "→ To:", toFeat.properties.label);

        const profiles = ["driving-car", "cycling-regular", "foot-walking"];
        const results = {};

        for (const profile of profiles) {
            try {
                const routeRes = await fetch(
                    `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${ORS_API_KEY}&start=${fromLon},${fromLat}&end=${toLon},${toLat}`
                ).then(r => r.json());

                if (routeRes.error) {
                    console.log(`Error for ${profile}:`, routeRes.error);
                    continue;
                }

                const feat = routeRes?.features?.[0];
                if (!feat) continue;

                const { distance, duration } = feat.properties.summary;
                results[profile] = {
                    distance: (distance / 1000).toFixed(1),
                    duration: (duration / 60).toFixed(1)
                };

                if (profile === "driving-car") results[profile].coordinates = feat.geometry.coordinates;
            } catch (err) {
                console.error(`Failed for ${profile}:`, err.message);
            }
        }

        if (Object.keys(results).length === 0) {
            return res.status(404).json({ error: "No routes found inside Nagpur city." });
        }

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch routes" });
    }
});




app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
