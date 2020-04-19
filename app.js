require("dotenv").config();
const express = require("express");
const camera = require("./services/camera.service");
const validator = require("./services/validator.service");
const errorHandler = require("./utils/errorHandler");

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

app.use(errorHandler);

module.exports = app;
