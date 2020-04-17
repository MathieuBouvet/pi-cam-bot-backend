require("dotenv").config();
const streamer = require("./streamerProcess");
const { EventEmitter } = require("events");
const findProcess = require("./processFinder");
const childProcess = require("child_process");
const axios = require("axios");

jest.mock("child_process");
jest.mock("axios");
jest.mock("./processFinder");

let mockedSpawnProcess = null;
childProcess.spawn.mockImplementation(() => {
  mockedSpawnProcess = new EventEmitter();
  mockedSpawnProcess.pid = 42;
  mockedSpawnProcess.kill = jest.fn();
  return mockedSpawnProcess;
});

axios.get.mockRejectedValue("network error");
axios.CancelToken.source.mockReturnValue({
  token: "token",
  cancel: jest.fn(),
});

findProcess.mockResolvedValue(null);

beforeEach(() => {
  childProcess.spawn.mockClear();
  mockedSpawnProcess && mockedSpawnProcess.kill.mockClear();
});

describe("mjpg stream starter", () => {
  it("should resolve to the started status", async () => {
    axios.get.mockResolvedValueOnce(true);
    await expect(streamer.start()).resolves.toEqual({ started: true });
  });
  it("should not spawn a new process if already started", async () => {
    findProcess.mockResolvedValueOnce(42);
    await streamer.start();
    expect(childProcess.spawn).not.toHaveBeenCalled();
  });
  it("should reject with an error if spawning is impossible", async () => {
    setTimeout(() => mockedSpawnProcess.emit("exit"));
    await expect(streamer.start()).rejects.toThrow();
  });
  it("should reject with an error if starting timeout is reached", async () => {
    jest.useFakeTimers();
    process.nextTick(jest.runOnlyPendingTimers);
    await expect(streamer.start()).rejects.toThrow();
  });
});
describe("mjpg stream stopper", () => {
  it("should resolve to the stopped status", async () => {
    jest.useRealTimers();
    axios.get.mockResolvedValueOnce(true);
    await streamer.start();
    findProcess.mockResolvedValueOnce(42);
    setTimeout(() => mockedSpawnProcess.emit("exit"));
    await expect(streamer.stop()).resolves.toEqual({ started: false });
    expect(mockedSpawnProcess.kill).toHaveBeenCalledTimes(1);
  });
  it("should not try to stopped a non started process", async () => {
    findProcess.mockResolvedValueOnce(null);
    await expect(streamer.stop()).resolves.toEqual({ started: false });
    expect(mockedSpawnProcess.kill).not.toHaveBeenCalled();
  });
  it("should reject with an error if impossible to stop", async () => {
    jest.useRealTimers();
    axios.get.mockResolvedValueOnce(true);
    await streamer.start();
    findProcess.mockResolvedValueOnce(42);
    setTimeout(() => mockedSpawnProcess.emit("error"));
    await expect(streamer.stop()).rejects.toThrow();
  });
});
