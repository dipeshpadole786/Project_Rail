import mongoose from 'mongoose';

const Schema = mongoose.Schema;
// --- 1. Your Schema and Model ---
const busScheduleSchema = new Schema({
    station_name: {
        type: String,
        required: true,
        unique: true
    },
    departures: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const busSchedule = mongoose.model('busSchedule', busScheduleSchema);
export default busSchedule;

// --- 2. Your Sample Data ---

const sampledata = [
    {
        "station_name": "Hingna Gramin Hospital",
        "departures": [
            "6:15 AM", "6:45 AM", "7:15 AM", "7:45 AM", "8:15 AM", "8:45 AM", "9:15 AM", "9:45 AM", "10:15 AM", "10:45 AM", "11:15 AM", "11:45 AM", "12:15 PM", "12:45 PM", "1:15 PM", "1:45 PM", "2:15 PM", "2:45 PM", "3:15 PM", "3:45 PM", "4:15 PM", "4:45 PM", "5:15 PM", "5:45 PM", "6:15 PM", "6:45 PM", "7:15 PM", "7:45 PM", "8:15 PM", "8:45 PM", "9:15 PM", "9:45 PM", "10:15 PM"
        ]
    },
    {
        "station_name": "Dhangar Pura",
        "departures": [
            "6:17 AM", "6:47 AM", "7:17 AM", "7:47 AM", "8:17 AM", "8:47 AM", "9:17 AM", "9:47 AM", "10:17 AM", "10:47 AM", "11:17 AM", "11:47 AM", "12:17 PM", "12:47 PM", "1:17 PM", "1:47 PM", "2:17 PM", "2:47 PM", "3:17 PM", "3:47 PM", "4:17 PM", "4:47 PM", "5:17 PM", "5:47 PM", "6:17 PM", "6:47 PM", "7:17 PM", "7:47 PM", "8:17 PM", "8:47 PM", "9:17 PM", "9:47 PM", "10:17 PM"
        ]
    },
    {
        "station_name": "Deshmukhwadi",
        "departures": [
            "6:19 AM", "6:49 AM", "7:19 AM", "7:49 AM", "8:19 AM", "8:49 AM", "9:19 AM", "9:49 AM", "10:19 AM", "10:49 AM", "11:19 AM", "11:49 AM", "12:19 PM", "12:49 PM", "1:19 PM", "1:49 PM", "2:19 PM", "2:49 PM", "3:19 PM", "3:49 PM", "4:19 PM", "4:49 PM", "5:19 PM", "5:49 PM", "6:19 PM", "6:49 PM", "7:19 PM", "7:49 PM", "8:19 PM", "8:49 PM", "9:19 PM", "9:49 PM", "10:19 PM"
        ]
    },
    {
        "station_name": "Bhosalewadi",
        "departures": [
            "6:21 AM", "6:51 AM", "7:21 AM", "7:51 AM", "8:21 AM", "8:51 AM", "9:21 AM", "9:51 AM", "10:21 AM", "10:51 AM", "11:21 AM", "11:51 AM", "12:21 PM", "12:51 PM", "1:21 PM", "1:51 PM", "2:21 PM", "2:51 PM", "3:21 PM", "3:51 PM", "4:21 PM", "4:51 PM", "5:21 PM", "5:51 PM", "6:21 PM", "6:51 PM", "7:21 PM", "7:51 PM", "8:21 PM", "8:51 PM", "9:21 PM", "9:51 PM", "10:21 PM"
        ]
    },
    {
        "station_name": "Hingna Gaon (MSRTC)",
        "departures": [
            "6:23 AM", "6:53 AM", "7:23 AM", "7:53 AM", "8:23 AM", "8:53 AM", "9:23 AM", "9:53 AM", "10:23 AM", "10:53 AM", "11:23 AM", "11:53 AM", "12:23 PM", "12:53 PM", "1:23 PM", "1:53 PM", "2:23 PM", "2:53 PM", "3:23 PM", "3:53 PM", "4:23 PM", "4:53 PM", "5:23 PM", "5:53 PM", "6:23 PM", "6:53 PM", "7:23 PM", "7:53 PM", "8:23 PM", "8:53 PM", "9:23 PM", "9:53 PM", "10:23 PM"
        ]
    },
    {
        "station_name": "Hingna Raipur",
        "departures": [
            "6:25 AM", "6:55 AM", "7:25 AM", "7:55 AM", "8:25 AM", "8:55 AM", "9:25 AM", "9:55 AM", "10:25 AM", "10:55 AM", "11:25 AM", "11:55 AM", "12:25 PM", "12:55 PM", "1:25 PM", "1:55 PM", "2:25 PM", "2:55 PM", "3:25 PM", "3:55 PM", "4:25 PM", "4:55 PM", "5:25 PM", "5:55 PM", "6:25 PM", "6:55 PM", "7:25 PM", "7:55 PM", "8:25 PM", "8:55 PM", "9:25 PM", "9:55 PM", "10:25 PM"
        ]
    },
    {
        "station_name": "Jinning Press",
        "departures": [
            "6:27 AM", "6:57 AM", "7:27 AM", "7:57 AM", "8:27 AM", "8:57 AM", "9:27 AM", "9:57 AM", "10:27 AM", "10:57 AM", "11:27 AM", "11:57 AM", "12:27 PM", "12:57 PM", "1:27 PM", "1:57 PM", "2:27 PM", "2:57 PM", "3:27 PM", "3:57 PM", "4:27 PM", "4:57 PM", "5:27 PM", "5:57 PM", "6:27 PM", "6:57 PM", "7:27 PM", "7:57 PM", "8:27 PM", "8:57 PM", "9:27 PM", "9:57 PM", "10:27 PM"
        ]
    },
    {
        "station_name": "Mahajan Wadi",
        "departures": [
            "6:29 AM", "6:59 AM", "7:29 AM", "7:59 AM", "8:29 AM", "8:59 AM", "9:29 AM", "9:59 AM", "10:29 AM", "10:59 AM", "11:29 AM", "11:59 AM", "12:29 PM", "12:59 PM", "1:29 PM", "1:59 PM", "2:29 PM", "2:59 PM", "3:29 PM", "3:59 PM", "4:29 PM", "4:59 PM", "5:29 PM", "5:59 PM", "6:29 PM", "6:59 PM", "7:29 PM", "7:59 PM", "8:29 PM", "8:59 PM", "9:29 PM", "9:59 PM", "10:29 PM"
        ]
    },
    {
        "station_name": "Wanadongri",
        "departures": [
            "6:31 AM", "7:01 AM", "7:31 AM", "8:01 AM", "8:31 AM", "9:01 AM", "9:31 AM", "10:01 AM", "10:31 AM", "11:01 AM", "11:31 AM", "12:01 PM", "12:31 PM", "1:01 PM", "1:31 PM", "2:01 PM", "2:31 PM", "3:01 PM", "3:31 PM", "4:01 PM", "4:31 PM", "5:01 PM", "5:31 PM", "6:01 PM", "6:31 PM", "7:01 PM", "7:31 PM", "8:01 PM", "8:31 PM", "9:01 PM", "9:31 PM", "10:01 PM", "10:31 PM"
        ]
    },
    {
        "station_name": "Y.C.C.E. College",
        "departures": [
            "6:33 AM", "7:03 AM", "7:33 AM", "8:03 AM", "8:33 AM", "9:03 AM", "9:33 AM", "10:03 AM", "10:33 AM", "11:03 AM", "11:33 AM", "12:03 PM", "12:33 PM", "1:03 PM", "1:33 PM", "2:03 PM", "2:33 PM", "3:03 PM", "3:33 PM", "4:03 PM", "4:33 PM", "5:03 PM", "5:33 PM", "6:03 PM", "6:33 PM", "7:03 PM", "7:33 PM", "8:03 PM", "8:33 PM", "9:03 PM", "9:33 PM", "10:03 PM", "10:33 PM"
        ]
    },
    {
        "station_name": "Rajiv Nagar",
        "departures": [
            "6:35 AM", "7:05 AM", "7:35 AM", "8:05 AM", "8:35 AM", "9:05 AM", "9:35 AM", "10:05 AM", "10:35 AM", "11:05 AM", "11:35 AM", "12:05 PM", "12:35 PM", "1:05 PM", "1:35 PM", "2:05 PM", "2:35 PM", "3:05 PM", "3:35 PM", "4:05 PM", "4:35 PM", "5:05 PM", "5:35 PM", "6:05 PM", "6:35 PM", "7:05 PM", "7:35 PM", "8:05 PM", "8:35 PM", "9:05 PM", "9:35 PM", "10:05 PM", "10:35 PM"
        ]
    },
    {
        "station_name": "Electronic Zone Chowk",
        "departures": [
            "6:37 AM", "7:07 AM", "7:37 AM", "8:07 AM", "8:37 AM", "9:07 AM", "9:37 AM", "10:07 AM", "10:37 AM", "11:07 AM", "11:37 AM", "12:07 PM", "12:37 PM", "1:07 PM", "1:37 PM", "2:07 PM", "2:37 PM", "3:07 PM", "3:37 PM", "4:07 PM", "4:37 PM", "5:07 PM", "5:37 PM", "6:07 PM", "6:37 PM", "7:07 PM", "7:37 PM", "8:07 PM", "8:37 PM", "9:07 PM", "9:37 PM", "10:07 PM", "10:37 PM"
        ]
    },
    {
        "station_name": "I.C. Chowk",
        "departures": [
            "6:39 AM", "7:09 AM", "7:39 AM", "8:09 AM", "8:39 AM", "9:09 AM", "9:39 AM", "10:09 AM", "10:39 AM", "11:09 AM", "11:39 AM", "12:09 PM", "12:39 PM", "1:09 PM", "1:39 PM", "2:09 PM", "2:39 PM", "3:09 PM", "3:39 PM", "4:09 PM", "4:39 PM", "5:09 PM", "5:39 PM", "6:09 PM", "6:39 PM", "7:09 PM", "7:39 PM", "8:09 PM", "8:39 PM", "9:09 PM", "9:39 PM", "10:09 PM", "10:39 PM"
        ]
    },
    {
        "station_name": "Lokmanya Nagar Metro Station",
        "departures": [
            "6:43 AM", "7:13 AM", "7:43 AM", "8:13 AM", "8:43 AM", "9:13 AM", "9:43 AM", "10:13 AM", "10:43 AM", "11:13 AM", "11:43 AM", "12:13 PM", "12:43 PM", "1:13 PM", "1:43 PM", "2:13 PM", "2:43 PM", "3:13 PM", "3:43 PM", "4:13 PM", "4:43 PM", "5:13 PM", "5:43 PM", "6:13 PM", "6:43 PM", "7:13 PM", "7:43 PM", "8:13 PM", "8:43 PM", "9:13 PM", "9:43 PM", "10:13 PM", "10:43 PM"
        ]
    },
    {
        "station_name": "Mahindra Colony",
        "departures": [
            "6:45 AM", "7:15 AM", "7:45 AM", "8:15 AM", "8:45 AM", "9:15 AM", "9:45 AM", "10:15 AM", "10:45 AM", "11:15 AM", "11:45 AM", "12:15 PM", "12:45 PM", "1:15 PM", "1:45 PM", "2:15 PM", "2:45 PM", "3:15 PM", "3:45 PM", "4:15 PM", "4:45 PM", "5:15 PM", "5:45 PM", "6:15 PM", "6:45 PM", "7:15 PM", "7:45 PM", "8:15 PM", "8:45 PM", "9:15 PM", "9:45 PM", "10:15 PM", "10:45 PM"
        ]
    },
    {
        "station_name": "Balajinagar",
        "departures": [
            "6:47 AM", "7:17 AM", "7:47 AM", "8:17 AM", "8:47 AM", "9:17 AM", "9:47 AM", "10:17 AM", "10:47 AM", "11:17 AM", "11:47 AM", "12:17 PM", "12:47 PM", "1:17 PM", "1:47 PM", "2:17 PM", "2:47 PM", "3:17 PM", "3:47 PM", "4:17 PM", "4:47 PM", "5:17 PM", "5:47 PM", "6:17 PM", "6:47 PM", "7:17 PM", "7:47 PM", "8:17 PM", "8:47 PM", "9:17 PM", "9:47 PM", "10:17 PM", "10:47 PM"
        ]
    },
    {
        "station_name": "Hingna Naka",
        "departures": [
            "6:49 AM", "7:19 AM", "7:49 AM", "8:19 AM", "8:49 AM", "9:19 AM", "9:49 AM", "10:19 AM", "10:49 AM", "11:19 AM", "11:49 AM", "12:19 PM", "12:49 PM", "1:19 PM", "1:49 PM", "2:19 PM", "2:49 PM", "3:19 PM", "3:49 PM", "4:19 PM", "4:49 PM", "5:19 PM", "5:49 PM", "6:19 PM", "6:49 PM", "7:19 PM", "7:49 PM", "8:19 PM", "8:49 PM", "9:19 PM", "9:49 PM", "10:19 PM", "10:49 PM"
        ]
    },
    {
        "station_name": "Vasudev Nagar",
        "departures": [
            "6:51 AM", "7:21 AM", "7:51 AM", "8:21 AM", "8:51 AM", "9:21 AM", "9:51 AM", "10:21 AM", "10:51 AM", "11:21 AM", "11:51 AM", "12:21 PM", "12:51 PM", "1:21 PM", "1:51 PM", "2:21 PM", "2:51 PM", "3:21 PM", "3:51 PM", "4:21 PM", "4:51 PM", "5:21 PM", "5:51 PM", "6:21 PM", "6:51 PM", "7:21 PM", "7:51 PM", "8:21 PM", "8:51 PM", "9:21 PM", "9:51 PM", "10:21 PM", "10:51 PM"
        ]
    },
    {
        "station_name": "Yashoda Nagar",
        "departures": [
            "6:53 AM", "7:23 AM", "7:53 AM", "8:23 AM", "8:53 AM", "9:23 AM", "9:53 AM", "10:23 AM", "10:53 AM", "11:23 AM", "11:53 AM", "12:23 PM", "12:53 PM", "1:23 PM", "1:53 PM", "2:23 PM", "2:53 PM", "3:23 PM", "3:53 PM", "4:23 PM", "4:53 PM", "5:23 PM", "5:53 PM", "6:23 PM", "6:53 PM", "7:23 PM", "7:53 PM", "8:23 PM", "8:53 PM", "9:23 PM", "9:53 PM", "10:23 PM", "10:53 PM"
        ]
    },
    {
        "station_name": "Taki Silm",
        "departures": [
            "6:55 AM", "7:25 AM", "7:55 AM", "8:25 AM", "8:55 AM", "9:25 AM", "9:55 AM", "10:25 AM", "10:55 AM", "11:25 AM", "11:55 AM", "12:25 PM", "12:55 PM", "1:25 PM", "1:55 PM", "2:25 PM", "2:55 PM", "3:25 PM", "3:55 PM", "4:25 PM", "4:55 PM", "5:25 PM", "5:55 PM", "6:25 PM", "6:55 PM", "7:25 PM", "7:55 PM", "8:25 PM", "8:55 PM", "9:25 PM", "9:55 PM", "10:25 PM", "10:55 PM"
        ]
    },
    {
        "station_name": "Hingna T Point",
        "departures": [
            "6:57 AM", "7:27 AM", "7:57 AM", "8:27 AM", "8:57 AM", "9:27 AM", "9:57 AM", "10:27 AM", "10:57 AM", "11:27 AM", "11:57 AM", "12:27 PM", "12:57 PM", "1:27 PM", "1:57 PM", "2:27 PM", "2:57 PM", "3:27 PM", "3:57 PM", "4:27 PM", "4:57 PM", "5:27 PM", "5:57 PM", "6:27 PM", "6:57 PM", "7:27 PM", "7:57 PM", "8:27 PM", "8:57 PM", "9:27 PM", "9:57 PM", "10:27 PM", "10:57 PM"
        ]
    },
    {
        "station_name": "Subhash Nagar",
        "departures": [
            "6:59 AM", "7:29 AM", "7:59 AM", "8:29 AM", "8:59 AM", "9:29 AM", "9:59 AM", "10:29 AM", "10:59 AM", "11:29 AM", "11:59 AM", "12:29 PM", "12:59 PM", "1:29 PM", "1:59 PM", "2:29 PM", "2:59 PM", "3:29 PM", "3:59 PM", "4:29 PM", "4:59 PM", "5:29 PM", "5:59 PM", "6:29 PM", "6:59 PM", "7:29 PM", "7:59 PM", "8:29 PM", "8:59 PM", "9:29 PM", "9:59 PM", "10:29 PM", "10:59 PM"
        ]
    },
    {
        "station_name": "Ambazari Park",
        "departures": [
            "7:01 AM", "7:31 AM", "8:01 AM", "8:31 AM", "9:01 AM", "9:31 AM", "10:01 AM", "10:31 AM", "11:01 AM", "11:31 AM", "12:01 PM", "12:31 PM", "1:01 PM", "1:31 PM", "2:01 PM", "2:31 PM", "3:01 PM", "3:31 PM", "4:01 PM", "4:31 PM", "5:01 PM", "5:31 PM", "6:01 PM", "6:31 PM", "7:01 PM", "7:31 PM", "8:01 PM", "8:31 PM", "9:01 PM", "9:31 PM", "10:01 PM", "10:31 PM"
        ]
    },
    {
        "station_name": "I.T. Park",
        "departures": [
            "7:03 AM", "7:33 AM", "8:03 AM", "8:33 AM", "9:03 AM", "9:33 AM", "10:03 AM", "10:33 AM", "11:03 AM", "11:33 AM", "12:03 PM", "12:33 PM", "1:03 PM", "1:33 PM", "2:03 PM", "2:33 PM", "3:03 PM", "3:33 PM", "4:03 PM", "4:33 PM", "5:03 PM", "5:33 PM", "6:03 PM", "6:33 PM", "7:03 PM", "7:33 PM", "8:03 PM", "8:33 PM", "9:03 PM", "9:33 PM", "10:03 PM", "10:33 PM"
        ]
    },
    {
        "station_name": "Mate Chowk",
        "departures": [
            "7:05 AM", "7:35 AM", "8:05 AM", "8:35 AM", "9:05 AM", "9:35 AM", "10:05 AM", "10:35 AM", "11:05 AM", "11:35 AM", "12:05 PM", "12:35 PM", "1:05 PM", "1:35 PM", "2:05 PM", "2:35 PM", "3:05 PM", "3:35 PM", "4:05 PM", "4:35 PM", "5:05 PM", "5:35 PM", "6:05 PM", "6:35 PM", "7:05 PM", "7:35 PM", "8:05 PM", "8:35 PM", "9:05 PM", "9:35 PM", "10:05 PM", "10:35 PM"
        ]
    },
    {
        "station_name": "Shraddhanand Peth Chowk",
        "departures": [
            "7:07 AM", "7:37 AM", "8:07 AM", "8:37 AM", "9:07 AM", "9:37 AM", "10:07 AM", "10:37 AM", "11:07 AM", "11:37 AM", "12:07 PM", "12:37 PM", "1:07 PM", "1:37 PM", "2:07 PM", "2:37 PM", "3:07 PM", "3:37 PM", "4:07 PM", "4:37 PM", "5:07 PM", "5:37 PM", "6:07 PM", "6:37 PM", "7:07 PM", "7:37 PM", "8:07 PM", "8:37 PM", "9:07 PM", "9:37 PM", "10:07 PM", "10:37 PM"
        ]
    },
    {
        "station_name": "Abhyankar Nagar",
        "departures": [
            "7:09 AM", "7:39 AM", "8:09 AM", "8:39 AM", "9:09 AM", "9:39 AM", "10:09 AM", "10:39 AM", "11:09 AM", "11:39 AM", "12:09 PM", "12:39 PM", "1:09 PM", "1:39 PM", "2:09 PM", "2:39 PM", "3:09 PM", "3:39 PM", "4:09 PM", "4:39 PM", "5:09 PM", "5:39 PM", "6:09 PM", "6:39 PM", "7:09 PM", "7:39 PM", "8:09 PM", "8:39 PM", "9:09 PM", "9:39 PM", "10:09 PM", "10:39 PM"
        ]
    },
    {
        "station_name": "L.A.D. College",
        "departures": [
            "7:11 AM", "7:41 AM", "8:11 AM", "8:41 AM", "9:11 AM", "9:41 AM", "10:11 AM", "10:41 AM", "11:11 AM", "11:41 AM", "12:11 PM", "12:41 PM", "1:11 PM", "1:41 PM", "2:11 PM", "2:41 PM", "3:11 PM", "3:41 PM", "4:11 PM", "4:41 PM", "5:11 PM", "5:41 PM", "6:11 PM", "6:41 PM", "7:11 PM", "7:41 PM", "8:11 PM", "8:41 PM", "9:11 PM", "9:41 PM", "10:11 PM", "10:41 PM"
        ]
    },
    {
        "station_name": "Shankar Nagar-2",
        "departures": [
            "7:13 AM", "7:43 AM", "8:13 AM", "8:43 AM", "9:13 AM", "9:43 AM", "10:13 AM", "10:43 AM", "11:13 AM", "11:43 AM", "12:13 PM", "12:43 PM", "1:13 PM", "1:43 PM", "2:13 PM", "2:43 PM", "3:13 PM", "3:43 PM", "4:13 PM", "4:43 PM", "5:13 PM", "5:43 PM", "6:13 PM", "6:43 PM", "7:13 PM", "7:43 PM", "8:13 PM", "8:43 PM", "9:13 PM", "9:43 PM", "10:13 PM", "10:43 PM"
        ]
    },
    {
        "station_name": "Ram Nagar",
        "departures": [
            "7:15 AM", "7:45 AM", "8:15 AM", "8:45 AM", "9:15 AM", "9:45 AM", "10:15 AM", "10:45 AM", "11:15 AM", "11:45 AM", "12:15 PM", "12:45 PM", "1:15 PM", "1:45 PM", "2:15 PM", "2:45 PM", "3:15 PM", "3:45 PM", "4:15 PM", "4:45 PM", "5:15 PM", "5:45 PM", "6:15 PM", "6:45 PM", "7:15 PM", "7:45 PM", "8:15 PM", "8:45 PM", "9:15 PM", "9:45 PM", "10:15 PM", "10:45 PM"
        ]
    },
    {
        "station_name": "Chhota Ram Nagar",
        "departures": [
            "7:17 AM", "7:47 AM", "8:17 AM", "8:47 AM", "9:17 AM", "9:47 AM", "10:17 AM", "10:47 AM", "11:17 AM", "11:47 AM", "12:17 PM", "12:47 PM", "1:17 PM", "1:47 PM", "2:17 PM", "2:47 PM", "3:17 PM", "3:47 PM", "4:17 PM", "4:47 PM", "5:17 PM", "5:47 PM", "6:17 PM", "6:47 PM", "7:17 PM", "7:47 PM", "8:17 PM", "8:47 PM", "9:17 PM", "9:47 PM", "10:17 PM", "10:47 PM"
        ]
    },
    {
        "station_name": "Tilak Nagar",
        "departures": [
            "7:19 AM", "7:49 AM", "8:19 AM", "8:49 AM", "9:19 AM", "9:49 AM", "10:19 AM", "10:49 AM", "11:19 AM", "11:49 AM", "12:19 PM", "12:49 PM", "1:19 PM", "1:49 PM", "2:19 PM", "2:49 PM", "3:19 PM", "3:49 PM", "4:19 PM", "4:49 PM", "5:19 PM", "5:49 PM", "6:19 PM", "6:49 PM", "7:19 PM", "7:49 PM", "8:19 PM", "8:49 PM", "9:19 PM", "9:49 PM", "10:19 PM", "10:49 PM"
        ]
    },
    {
        "station_name": "Law College Chowk",
        "departures": [
            "7:21 AM", "7:51 AM", "8:21 AM", "8:51 AM", "9:21 AM", "9:51 AM", "10:21 AM", "10:51 AM", "11:21 AM", "11:51 AM", "12:21 PM", "12:51 PM", "1:21 PM", "1:51 PM", "2:21 PM", "2:51 PM", "3:21 PM", "3:51 PM", "4:21 PM", "4:51 PM", "5:21 PM", "5:51 PM", "6:21 PM", "6:51 PM", "7:21 PM", "7:51 PM", "8:21 PM", "8:51 PM", "9:21 PM", "9:51 PM", "10:21 PM", "10:51 PM"
        ]
    },
    {
        "station_name": "Giripeth",
        "departures": [
            "7:23 AM", "7:53 AM", "8:23 AM", "8:53 AM", "9:23 AM", "9:53 AM", "10:23 AM", "10:53 AM", "11:23 AM", "11:53 AM", "12:23 PM", "12:53 PM", "1:23 PM", "1:53 PM", "2:23 PM", "2:53 PM", "3:23 PM", "3:53 PM", "4:23 PM", "4:53 PM", "5:23 PM", "5:53 PM", "6:23 PM", "6:53 PM", "7:23 PM", "7:53 PM", "8:23 PM", "8:53 PM", "9:23 PM", "9:53 PM", "10:23 PM", "10:53 PM"
        ]
    },
    {
        "station_name": "Bhole Petrol Pump",
        "departures": [
            "7:25 AM", "7:55 AM", "8:25 AM", "8:55 AM", "9:25 AM", "9:55 AM", "10:25 AM", "10:55 AM", "11:25 AM", "11:55 AM", "12:25 PM", "12:55 PM", "1:25 PM", "1:55 PM", "2:25 PM", "2:55 PM", "3:25 PM", "3:55 PM", "4:25 PM", "4:55 PM", "5:25 PM", "5:55 PM", "6:25 PM", "6:55 PM", "7:25 PM", "7:55 PM", "8:25 PM", "8:55 PM", "9:25 PM", "9:55 PM", "10:25 PM", "10:55 PM"
        ]
    },
    {
        "station_name": "Maharaja Baug Gate",
        "departures": [
            "7:27 AM", "7:57 AM", "8:27 AM", "8:57 AM", "9:27 AM", "9:57 AM", "10:27 AM", "10:57 AM", "11:27 AM", "11:57 AM", "12:27 PM", "12:57 PM", "1:27 PM", "1:57 PM", "2:27 PM", "2:57 PM", "3:27 PM", "3:57 PM", "4:27 PM", "4:57 PM", "5:27 PM", "5:57 PM", "6:27 PM", "6:57 PM", "7:27 PM", "7:57 PM", "8:27 PM", "8:57 PM", "9:27 PM", "9:57 PM", "10:27 PM", "10:57 PM"
        ]
    },
    {
        "station_name": "Sitabuldi Bus Terminal",
        "departures": [
            "7:29 AM", "7:59 AM", "8:29 AM", "8:59 AM", "9:29 AM", "9:59 AM", "10:29 AM", "10:59 AM", "11:29 AM", "11:59 AM", "12:29 PM", "12:59 PM", "1:29 PM", "1:59 PM", "2:29 PM", "2:59 PM", "3:29 PM", "3:59 PM", "4:29 PM", "4:59 PM", "5:29 PM", "5:59 PM", "6:29 PM", "6:59 PM", "7:29 PM", "7:59 PM", "8:29 PM", "8:59 PM", "9:29 PM", "9:59 PM", "10:29 PM", "10:59 PM"
        ]
    },
    {
        "station_name": "Sitabuldi",
        "departures": [
            "7:31 AM", "8:01 AM", "8:31 AM", "9:01 AM", "9:31 AM", "10:01 AM", "10:31 AM", "11:01 AM", "11:31 AM", "12:01 PM", "12:31 PM", "1:01 PM", "1:31 PM", "2:01 PM", "2:31 PM", "3:01 PM", "3:31 PM", "4:01 PM", "4:31 PM", "5:01 PM", "5:31 PM", "6:01 PM", "6:31 PM", "7:01 PM", "7:31 PM", "8:01 PM", "8:31 PM", "9:01 PM", "9:31 PM", "10:01 PM", "10:31 PM"
        ]
    }
]


// --- 3. Database Connection and Data Insertion Function ---

// Your MongoDB connection string. Replace 'metroDB' with your database name.
const MONGO_URI = 'mongodb://127.0.0.1:27017/metroDB';

/**
 * Connects to MongoDB and inserts the metro schedule data.
 * It checks if data already exists to avoid duplication.
 */
async function seedDatabase() {
    try {
        // Connect to the database
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        // ❗ Check if the collection is already populated
        const count = await busSchedule.countDocuments();
        if (count > 0) {
            console.log('Database has already been seeded. Skipping insertion.');
            return; // Exit the function if data exists
        }

        // Use insertMany for efficient bulk insertion
        console.log('Inserting data...');
        await busSchedule.insertMany(sampledata);
        console.log('✅ Data successfully of bus is seeded!');

    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        // Ensure the connection is closed after the script runs
        console.log('Closing MongoDB connection.');
        mongoose.connection.close();
    }
}

// --- 4. Run the Function ---
// seedDatabase();