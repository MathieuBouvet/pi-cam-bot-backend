const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "PUT");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-max-age", "86400");
  next();
});

app.put("/hello/camera", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

module.exports = app;
