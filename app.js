import express from "express";
import cors from "cors";
import userRouter from "./router/user.routes.js";
import cookieParser from "cookie-parser";
import expressWs from "express-ws";
import { submitAnswer } from "./controller/user.controller.js";

const app = express();
expressWs(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/ws", userRouter);

app.ws("/ws", (ws, req) => {
  ws.on("message", async function (msg) {
    await submitAnswer(msg, ws)
  });
});

export default app;
