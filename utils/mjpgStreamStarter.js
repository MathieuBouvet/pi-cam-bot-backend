const { spawn } = require("child_process");

module.exports = async (commandString = process.env.MJPG) => {
  const [command, ...args] = commandString.split(" ");
  const process = spawn(command, args);
  return commandError(process).promise;
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
