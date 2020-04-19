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
  try {
    await Promise.race(cleanablePromises.map((i) => i.promise));
    streamProcess = child;
    return { started: true };
  } finally {
    cleanablePromises.forEach((i) => i.clean());
  }
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
  const source = axios.CancelToken.source();
  let interval = null;
  const serverReadyPromise = new Promise((resolve) => {
    interval = setInterval(() => {
      axios
        .get(`${process.env.MJPG_URL}/?action=snapshot`, {
          cancelToken: source.token,
        })
        .then(() => {
          return resolve();
        })
        .catch(() => null);
    }, 350);
  });
  return {
    promise: serverReadyPromise,
    clean: () => {
      source.cancel();
      clearInterval(interval);
    },
  };
}

const stop = async () => {
  const mjpgPid = await findStreamProcess("mjpg_streamer");
  if (!mjpgPid) {
    streamProcess = null;
    return { started: false };
  }
  let resolveStop = null;
  let rejectStop = null;
  try {
    const stopResult = await new Promise((resolve, reject) => {
      resolveStop = () => resolve({ started: false });
      rejectStop = () =>
        reject(new Error("Mjpg streamer could not be stopped"));
      streamProcess.once("exit", resolveStop);
      streamProcess.once("error", rejectStop);
      streamProcess.kill("SIGINT");
    });
    return stopResult;
  } finally {
    streamProcess.removeListener("exit", resolveStop);
    streamProcess.removeListener("error", rejectStop);
    streamProcess = null;
  }
};

module.exports = {
  start,
  stop,
};
