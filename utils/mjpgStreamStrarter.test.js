require("dotenv").config();
const startMjpgStream = require("./mjpgStreamStarter");
const findProcess = require("./processFinder");
const childProcess = require("child_process");
const { ChildProcess, exec } = childProcess;

describe("Mjpg stream starter", () => {
  afterEach(async () => {
    const process = await findProcess("mjpg_streamer");
    return new Promise((resolve, reject) => {
      if (!process) {
        return resolve();
      }
      exec("kill " + process, (err) => {
        return err ? reject(err) : resolve();
      });
    });
  });
  it("should resolve to a child process once the streamer is started", async () => {
    const streamerProcess = await startMjpgStream();
    expect(streamerProcess).toBe(expect.any(ChildProcess));
    expect(await findProcess("mjpg_streamer")).toBe(streamerProcess.pid);
  });
  it("should reject with an error when unable to start", async () => {
    const process = startMjpgStream(
      "mjpg_streamer -i bad_input.so -o output_http.so"
    );
    await expect(process).rejects.toThrow();
  });
  it("should reject with an error when timeout is reached", async () => {
    const theErrorConsole = console.error;
    console.error = jest.fn();
    const process = startMjpgStream("sleep 6");
    await expect(process).rejects.toThrow();
    console.error = theErrorConsole;
  }, 7000);
});
