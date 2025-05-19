import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import ServerlessHttp from "serverless-http";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/notesRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({ message: err.message });
});
app.get("/", (req, res) => {
  res.send("Backend is Running!");
});
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
