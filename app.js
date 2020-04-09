const express = require("express");

const app = express();

app.put("/hello/camera", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

module.exports = app;
