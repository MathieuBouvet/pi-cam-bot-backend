import camera from "./camera.service";
import streamerProcess from "../utils/streamerProcess";
import { mocked } from "ts-jest/utils";

jest.mock("../utils/streamerProcess");
jest.mock("../utils/synchronizer", () => () => (callback: any) => async () =>
  callback()
);

const mockedStreramerProcesss = mocked(streamerProcess, true);

mockedStreramerProcesss.start.mockResolvedValue({ started: true });
mockedStreramerProcesss.stop.mockResolvedValue({ started: false });

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
