import "dotenv/config";
import { mocked } from "ts-jest/utils";
import streamer from "./streamerProcess";
import { EventEmitter } from "events";
import findProcess from "./processFinder";
import childProcess from "child_process";
import axios from "axios";

interface MockedProcess extends EventEmitter {
  pid?: number;
  kill?: jest.Mock;
}

jest.mock("child_process");
jest.mock("axios");
jest.mock("./processFinder");

const mockedChildProcess = mocked(childProcess, true);
const mockedAxios = mocked(axios, true);
const mockFindProcess = mocked(findProcess, true);

let mockedSpawnProcess: MockedProcess;
mockedChildProcess.spawn.mockImplementation(() => {
  mockedSpawnProcess = new EventEmitter();
  mockedSpawnProcess.pid = 42;
  mockedSpawnProcess.kill = jest.fn();
  return (mockedSpawnProcess as unknown) as childProcess.ChildProcess;
});

mockedAxios.get.mockRejectedValue("network error");
mockedAxios.CancelToken.source.mockReturnValue({
  token: {
    promise: new Promise(() => null),
    throwIfRequested: () => null,
  },
  cancel: jest.fn(),
});

mockFindProcess.mockResolvedValue(null);

beforeEach(() => {
  mockedChildProcess.spawn.mockClear();
  mockedSpawnProcess &&
    mockedSpawnProcess.kill &&
    mockedSpawnProcess.kill.mockClear();
});

describe("mjpg stream starter", () => {
  it("should resolve to the started status", async () => {
    mockedAxios.get.mockResolvedValueOnce(true);
    await expect(streamer.start()).resolves.toEqual({ started: true });
  });
  it("should not spawn a new process if already started", async () => {
    mockFindProcess.mockResolvedValueOnce(42);
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
    mockedAxios.get.mockResolvedValueOnce(true);
    await streamer.start();
    mockFindProcess.mockResolvedValueOnce(42);
    setTimeout(() => mockedSpawnProcess.emit("exit"));
    await expect(streamer.stop()).resolves.toEqual({ started: false });
    expect(mockedSpawnProcess.kill).toHaveBeenCalledTimes(1);
  });
  it("should not try to stopped a non started process", async () => {
    mockFindProcess.mockResolvedValueOnce(null);
    await expect(streamer.stop()).resolves.toEqual({ started: false });
    expect(mockedSpawnProcess.kill).not.toHaveBeenCalled();
  });
  it("should reject with an error if impossible to stop", async () => {
    jest.useRealTimers();
    mockedAxios.get.mockResolvedValueOnce(true);
    await streamer.start();
    mockFindProcess.mockResolvedValueOnce(42);
    setTimeout(() => mockedSpawnProcess.emit("error"));
    await expect(streamer.stop()).rejects.toThrow();
  });
});
