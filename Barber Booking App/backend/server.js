import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();

app.use(express.json());

// CORS toestaan voor frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", authRoutes);

// Database verbinden en server starten
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Database verbonden & server draait");
    });
  })
  .catch((err) => console.error(err));
