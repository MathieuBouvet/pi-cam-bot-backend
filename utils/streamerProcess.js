const { spawn } = require("child_process");
const axios = require("axios");
const findStreamProcess = require("./processFinder");

let streamProcess = null;

const start = async (commandString = process.env.MJPG) => {
  const streamPid = await findStreamProcess("mjpg_streamer");
  if (streamPid) {
    return { started: true };
  }
  const [command, ...args] = commandString.split(" ");
  const child = spawn(command, args);
  const cleanablePromises = [
    commandError(child),
    unableToStartTimeout(),
    serverReady(),
  ];
  await Promise.race(cleanablePromises.map((i) => i.promise));
  cleanablePromises.forEach((i) => i.clean());
  streamProcess = child;
  return { started: true };
};

function commandError(process) {
  let exitHandler = null;
  const commandErrorPromise = new Promise((resolve, reject) => {
    exitHandler = () => reject(new Error("Unable to start the process"));
    process.on("exit", exitHandler);
  });
  return {
    promise: commandErrorPromise,
    clean: () => process.removeListener("exit", exitHandler),
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

function serverReady() {
  let interval = null;
  const serverReadyPromise = new Promise((resolve) => {
    interval = setInterval(() => {
      axios
        .get(`${process.env.MJPG_URL}/?action=snapshot`)
        .then(() => {
          return resolve();
        })
        .catch(() => null);
    }, 350);
  });
  return {
    promise: serverReadyPromise,
    clean: () => clearInterval(interval),
  };
}

module.exports = {
  start,
};
