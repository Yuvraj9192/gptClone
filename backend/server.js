import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import connectDB from "./db.js";
import chatRoute from "./routes/chat.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", chatRoute);

app.listen(8000, () => {
    console.log("App is listening on port 8000");
});