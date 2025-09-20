import mongoose from "mongoose";

const sampleTrains = [
    {
        userId: "1000000001",
        trainNo: "12139",
        trainName: "Sewagram Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Mumbai CST, Maharashtra",
        fromCoords: [21.1501, 79.0882],
        departureTime: "09:15",
        date: "2025-08-27",
        delayMinutes: 30,
    },
    {
        userId: "1000000002",
        trainNo: "12855",
        trainName: "Bilaspur–Itwari Intercity Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Bilaspur Junction, Chhattisgarh",
        fromCoords: [21.1501, 79.0882],
        departureTime: "06:35",
        date: "2025-08-27",
        delayMinutes: 0,
    },
    {
        userId: "1000000003",
        trainNo: "12105",
        trainName: "Vidarbha Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Mumbai CST, Maharashtra",
        fromCoords: [21.1501, 79.0882],
        departureTime: "19:10",
        date: "2025-08-27",
        delayMinutes: 15,
    },
    {
        userId: "1000000004",
        trainNo: "12655",
        trainName: "Navjeevan Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Chennai Central, Tamil Nadu",
        fromCoords: [21.1501, 79.0882],
        departureTime: "10:25",
        date: "2025-08-27",
        delayMinutes: 5,
    },
    {
        userId: "1000000005",
        trainNo: "12290",
        trainName: "Nagpur Duronto Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Mumbai CST, Maharashtra",
        fromCoords: [21.1501, 79.0882],
        departureTime: "20:40",
        date: "2025-08-27",
        delayMinutes: 0,
    },
    {
        userId: "1000000006",
        trainNo: "18239",
        trainName: "Shivnath Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Bilaspur Junction, Chhattisgarh",
        fromCoords: [21.1501, 79.0882],
        departureTime: "23:55",
        date: "2025-08-27",
        delayMinutes: 10,
    },
    {
        userId: "1000000007",
        trainNo: "12616",
        trainName: "Grand Trunk Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Chennai Central, Tamil Nadu",
        fromCoords: [21.1501, 79.0882],
        departureTime: "11:45",
        date: "2025-08-27",
        delayMinutes: 20,
    },
    {
        userId: "1000000008",
        trainNo: "12834",
        trainName: "Howrah–Ahmedabad Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Ahmedabad Junction, Gujarat",
        fromCoords: [21.1501, 79.0882],
        departureTime: "02:05",
        date: "2025-08-27",
        delayMinutes: 0,
    },
    {
        userId: "1000000009",
        trainNo: "12622",
        trainName: "Tamil Nadu Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Chennai Central, Tamil Nadu",
        fromCoords: [21.1501, 79.0882],
        departureTime: "14:15",
        date: "2025-08-27",
        delayMinutes: 45,
        

    },
    {
        userId: "1000000010",
        trainNo: "12160",
        trainName: "Jabalpur–Amravati Express",
        from: "Nagpur Junction, Maharashtra",
        to: "Amravati Terminal, Maharashtra",
        fromCoords: [21.1501, 79.0882],
        departureTime: "16:20",
        date: "2025-08-27",
        delayMinutes: 0,
    },
];

const trainSchema = new mongoose.Schema({
    userId: {
        type: String, // "1234567890" (could be booking ID, PNR, or unique key)
        required: true,
        unique: true,
    },
    trainNo: {
        type: String,
        required: true,
    },
    trainName: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    fromCoords: {
        type: [Number], // [latitude, longitude]
        validate: {
            validator: (v) => v.length === 2,
            message: "fromCoords must have [lat, lng]",
        },
        required: true,
    },
    departureTime: {
        type: String, // storing "09:15" in HH:mm format
        required: true,
    },
    date: {
        type: Date, // "2025-08-26"
        required: true,
    },
    delayMinutes: {
        type: Number, // in minutes
        default: 0,
    },
});
const insertSampleData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://127.0.0.1:27017/metroDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected");

        // Clear old data (optional)
        await Train.deleteMany({});
        console.log("🗑️ Old data cleared");

        // Insert new data
        await Train.insertMany(sampleTrains);
        console.log("🚂 Sample train data inserted successfully!");
    } catch (error) {
        console.error("❌ Error inserting data:", error);
    } finally {
        // Close connection
        mongoose.connection.close();
    }
};

// Run function
// insertSampleData();

const Train = mongoose.model("Train", trainSchema);

export default Train;
