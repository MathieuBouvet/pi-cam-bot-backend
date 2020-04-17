require("dotenv").config();
const streamer = require("../utils/streamerProcess");
const findProcess = require("../utils/processFinder");
const childProcess = require("child_process");
const { execSync } = childProcess;

afterEach(async () => {
  const process = await findProcess("mjpg_streamer");
  if (process) {
    execSync("kill " + process);
  }
});

describe("mjpg stream starter", () => {
  it("should resolve to status object once the streamer is started", async () => {
    const streamerProcess = await streamer.start();
    expect(streamerProcess).toEqual({ started: true });
    expect(await findProcess("mjpg_streamer")).not.toBeNull();
  });
  it("should not try to start a new process if already started", async () => {
    await streamer.start();
    await expect(streamer.start()).resolves;
  });
  it("should reject with an error when unable to start", async () => {
    const process = streamer.start(
      "mjpg_streamer -i bad_input.so -o output_http.so"
    );
    await expect(process).rejects.toThrow();
  });
  it("should reject with an error when timeout is reached", async () => {
    const theErrorConsole = console.error;
    console.error = jest.fn();
    const process = streamer.start("sleep 6");
    await expect(process).rejects.toThrow();
    const sleep = await findProcess("sleep");
    if (sleep) {
      execSync("kill " + sleep);
    }
    console.error = theErrorConsole;
  }, 7000);
});

describe("mjpg stream stopper ", () => {
  it("should stop the process and resolve with the status", async () => {
    await streamer.start();
    const stopper = await streamer.stop();
    expect(stopper).toEqual({ started: false });
    expect(await findProcess("mjpg_streamer")).toBeNull();
  });
  it("should not try to stop a non started process", async () => {
    expect(await streamer.stop()).toEqual({ started: false });
  });
});
