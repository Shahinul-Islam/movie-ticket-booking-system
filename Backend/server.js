require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const bookingRoutes = require("./routes/bookings");
const showtimeRoutes = require("./routes/showtimes");
// ... other route imports

const app = express();

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.8gymk77.mongodb.net/online_ticket_booking?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/showtimes", showtimeRoutes);

// ... other route uses

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
