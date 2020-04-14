const { spawn } = require("child_process");

module.exports = async (commandString = process.env.MJPG) => {
  const [command, ...args] = commandString.split(" ");
  const process = spawn(command, args);
  const cleanablePromises = [commandError(process), unableToStartTimeout()];
  const streamStarted = await Promise.race(
    cleanablePromises.map((i) => i.promise)
  );
  cleanablePromises.forEach((i) => i.clean());
  return streamStarted;
};

function commandError(process) {
  let exitHandler = null;
  const commandErrorPromise = new Promise((resolve, reject) => {
    exitHandler = () => reject(new Error("Unable to start the process"));
    process.on("exit", exitHandler);
  });
  const clean = () => {
    process.removeListener("exit", exitHandler);
  };
  return {
    promise: commandErrorPromise,
    clean,
  };
}

function unableToStartTimeout(duration = 5000) {
  let timeout = null;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(
      reject,
      duration,
      new Error("start process timeout reached")
    );
  });
  return {
    promise: timeoutPromise,
    clean: () => clearTimeout(timeout),
  };
}
