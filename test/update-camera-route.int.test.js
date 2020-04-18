const supertest = require("supertest");
const app = require("../app");
const findProcess = require("../utils/processFinder");

const request = supertest(app);

it("should start the streamer on {started: true}", async () => {
  const result = await request.put("/robot/camera").send({ started: true });
  expect(result.body).toEqual({ started: true });
  await expect(findProcess("mjpg_streamer")).resolves.not.toBeNull();
});

it("should stop the streamer on {started: false}", async () => {
  const result = await request.put("/robot/camera").send({ started: false });
  expect(result.body).toEqual({ started: false });
  await expect(findProcess("mjpg_streamer")).resolves.toBeNull();
});
