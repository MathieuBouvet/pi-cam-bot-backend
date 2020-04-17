require("dotenv").config();
const streamer = require("../utils/streamerProcess");
const findProcess = require("../utils/processFinder");

it("should resolve to status object once the streamer is started", async () => {
  const streamerProcess = await streamer.start();
  expect(streamerProcess).toEqual({ started: true });
  expect(await findProcess("mjpg_streamer")).not.toBeNull();
});

it("should stop the process and resolve with the status", async () => {
  const stopper = await streamer.stop();
  expect(stopper).toEqual({ started: false });
  expect(await findProcess("mjpg_streamer")).toBeNull();
});
