const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({ path: require("path").resolve(__dirname, "./.env") });
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", require("./Routes/userrouters"));
app.use("/contact", require("./Routes/contactroutes"));

// Mongoose connection options
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Use environment-provided MongoDB Atlas connection string only.
    const rawUrl = process.env.MONGODB_URL?.trim();
    if (!rawUrl) {
      throw new Error("MONGODB_URL is not set in environment (.env)");
    }
    const mongoUrl = rawUrl.replace(/^\"|\"$/g, "");

    console.log(
      "Connection string: " + (mongoUrl.length > 50 ? mongoUrl.substring(0, 50) + "..." : mongoUrl)
    );

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    
    console.log("✓ MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("✓ Server running on port 3000");
      console.log("\nAPI Endpoints:");
      console.log("  Users: GET/POST http://localhost:3000/users");
      console.log("  Users Detail: GET/PUT/DELETE http://localhost:3000/users/:id");
      console.log("  Contact: GET/POST http://localhost:3000/contact");
      console.log("  Contact Detail: PUT/DELETE http://localhost:3000/contact/:id");
    });
  } catch (err) {
    console.error("✗ MongoDB connection error:", err.message);
    console.error("\nPlease ensure:");
    console.error("1. MongoDB is running (locally or on Atlas)");
    console.error("2. Check your .env file for correct MONGODB_URL");
    console.error("3. For Atlas: Add your IP to whitelist (0.0.0.0/0)");
    console.error("\nSee QUICKSTART.md for setup instructions");
    process.exit(1);
  }
};

connectDB();
  