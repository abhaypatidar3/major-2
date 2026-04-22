import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./router/userRoute.js";
import symptomRoute from "./router/symptomRoute.js";
import aiRoute from "./router/aiRoute.js";
import remedyRoutes from "./router/remedyRoutes.js";
import cycleRoute from "./router/cycleRoute.js";
import riskRoute from "./router/riskRoute.js";
import doctorRoutes from "./router/doctorRoutes.js";

config({ path: "./config/config.env" });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

app.use("/api/v1/doctors", doctorRoutes);

connection();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/symptoms", symptomRoute);
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/remedy", remedyRoutes);
app.use("/api/v1/cycle", cycleRoute);
app.use("/api/v1/risk", riskRoute);

app.use(errorMiddleware);

export default app;
