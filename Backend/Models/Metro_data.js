const mongoose = require('mongoose');

import mongoose from "mongoose";

const metroTripSchema = new mongoose.Schema({
    fromStation: {
        type: String,
        required: true
    },
    toStation: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    stops: [
        {
            station: {
                type: String,
                required: true
            },
            arrivalTime: {
                type: String,
                required: true
            }
        }
    ]
});

const MetroTrip = mongoose.model('MetroTrip', metroTripSchema);

export default MetroTrip;

