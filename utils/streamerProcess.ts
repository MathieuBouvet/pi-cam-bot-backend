import { spawn, ChildProcess } from "child_process";
import axios from "axios";
import findStreamProcess from "./processFinder";

interface CameraStatus {
  started: boolean;
}
interface Cleanable {
  clean: () => void;
}
interface WrappedPromise<T> {
  promise: Promise<T>;
}
type CleanablePromise<T> = Cleanable & WrappedPromise<T>;

let streamProcess: ChildProcess | null = null;

const start = async (): Promise<CameraStatus> => {
  const commandString = process.env.MJPG || "";
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

function commandError(process: ChildProcess): CleanablePromise<null> {
  let exitHandler: () => void = () => null;
  const commandErrorPromise: Promise<null> = new Promise((resolve, reject) => {
    exitHandler = () => reject(new Error("Unable to start the process"));
    process.on("exit", exitHandler);
  });
  return {
    promise: commandErrorPromise,
    clean: () => process.removeListener("exit", exitHandler),
  };
}

function unableToStartTimeout(duration = 5000): CleanablePromise<null> {
  let timeout: NodeJS.Timeout;
  const timeoutPromise = new Promise<null>((_, reject) => {
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

function serverReady(): CleanablePromise<null> {
  const source = axios.CancelToken.source();
  let interval: NodeJS.Timeout;
  const serverReadyPromise = new Promise<null>((resolve) => {
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

const stop = async (): Promise<CameraStatus> => {
  const mjpgPid = await findStreamProcess("mjpg_streamer");
  if (!mjpgPid) {
    streamProcess = null;
    return { started: false };
  }
  let resolveStop: () => void = () => null;
  let rejectStop: () => void = () => null;
  try {
    const stopResult = await new Promise<CameraStatus>((resolve, reject) => {
      resolveStop = () => resolve({ started: false });
      rejectStop = () =>
        reject(new Error("Mjpg streamer could not be stopped"));
      if (streamProcess) {
        streamProcess.once("exit", resolveStop);
        streamProcess.once("error", rejectStop);
        streamProcess.kill("SIGINT");
      }
    });
    return stopResult;
  } finally {
    if (streamProcess) {
      streamProcess.removeListener("exit", resolveStop);
      streamProcess.removeListener("error", rejectStop);
      streamProcess = null;
    }
  }
};

export default {
  start,
  stop,
};
