import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU0NDY3MjA3MjY4MDQ3MjA5ZDJmOTM2MjllYjZhZWM5IiwiaCI6Im11cm11cjY0In0=";

app.use(cors());
app.use(express.json());

// Nagpur city bounding box
const NAGPUR_CITY_BBOX = "78.95,21.05,79.2,21.25";

async function geocode(place) {
    const res = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(place)}&boundary.rect=${NAGPUR_CITY_BBOX}`
    );
    const data = await res.json();
    const feat = data?.features?.[0];

    // Check locality/county
    if (
        !feat?.properties?.locality?.includes("Nagpur") &&
        !feat?.properties?.county?.includes("Nagpur")
    ) {
        return null;
    }

    return feat;
}

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
