import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import serverless from "serverless-http";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/notesRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://smart-notes-app-five.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(errorHandler);

app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({ message: err.message });
});

export const handler = serverless(app);

if (process.env.NODE_ENV !== "lambda") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
