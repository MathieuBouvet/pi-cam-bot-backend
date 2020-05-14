import supertest from "supertest";
import app from "../app";
import findProcess from "../utils/processFinder";

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
it.each([
  [""],
  ["false"],
  [{ invalid: "42" }],
  [{ started: "42" }],
  [{ started: true, invalid: true }],
])(
  "should respond with http 400 when input is invalid (tested: %s)",
  async (input) => {
    const result = await request.put("/robot/camera").send(input);
    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      code: 400,
      reason: "Bad Request",
      message: "invalid camera input",
    });
  }
);
