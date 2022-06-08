import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";

import socketUtil from "./utils/socket.js";
import { socketConfig } from "./config/socket.config.js";

dotenv.config();
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});
app.use(express.json());
const server = createServer(app);
socketUtil.attach(server, socketConfig.SERVER_OPTIONS);

server.listen(process.env.PORT, () => {
  console.log(`listening on :${process.env.PORT}`);
});
