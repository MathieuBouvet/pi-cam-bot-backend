const camera = require("./camera.service");
const streamerProcess = require("../utils/streamerProcess");

jest.mock("../utils/streamerProcess");
jest.mock("../utils/synchronizer", () => () => (callback) => async () =>
  callback()
);

streamerProcess.start.mockResolvedValue({ started: true });
streamerProcess.stop.mockResolvedValue({ started: false });

it("should start the camera", async () => {
  const result = await camera.update({ started: true });
  expect(result).toEqual({ started: true });
  expect(streamerProcess.start).toHaveBeenCalledTimes(1);
});
it("should stop the camera", async () => {
  const result = await camera.update({ started: false });
  expect(result).toEqual({ started: false });
  expect(streamerProcess.stop).toHaveBeenCalledTimes(1);
});
