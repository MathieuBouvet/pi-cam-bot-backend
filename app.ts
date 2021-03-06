import "dotenv/config";
import express from "express";
import camera from "./services/camera.service";
import movement from "./services/movement.service";
import validator from "./services/validator.service";
import { http400Handler } from "./utils/errorHandler";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "PUT");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-max-age", "86400");
  next();
});

app.put("/robot/camera", async (req, res, next) => {
  try {
    const wantedCameraStatus = validator.camera(req.body);
    const cameraStatus = await camera.update(wantedCameraStatus);
    res.status(200).send(cameraStatus);
  } catch (err) {
    next(err);
  }
});

app.put("/robot/movement", (req, res) => {
  const whantedMovement = validator.movement(req.body);
  movement.update(whantedMovement);
  res.status(204).send();
});

app.use(http400Handler);

export default app;
