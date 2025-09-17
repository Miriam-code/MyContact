import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./config/.env" });

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(cors({ origin: `${process.env.CORS}` }));

server.use("/public", express.static(path.join(__dirname, "/public")));


connectDB();

server.listen(process.env.PORT, () => {
  console.log(`Serveur écoute le port ${process.env.PORT}`);
});

export default server;
