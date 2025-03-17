const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();




const matchRoutes = require("./routes/matches");
const questionRoutes = require("./routes/questions");
const responseRoutes = require("./routes/responses");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");



const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/auth", authRoutes);
app.use("/matches", matchRoutes);
app.use("/questions", questionRoutes);
app.use("/responses", responseRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(5123, () => console.log("Server running on port 5123"));
