require("dotenv").config();
const streamer = require("./streamerProcess");
const findProcess = require("./processFinder");
const childProcess = require("child_process");
const { execSync } = childProcess;

describe("Mjpg stream starter", () => {
  afterEach(async () => {
    const process = await findProcess("mjpg_streamer");
    if (process) {
      execSync("kill " + process);
    }
  });
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
