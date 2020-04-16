const streamer = require("../utils/streamerProcess");
const withSynchronization = require("../utils/synchronizer")();

const synchronizedStart = withSynchronization(streamer.start);
const synchronizedStop = withSynchronization(streamer.stop);

async function update(status) {
  const action = status.started ? synchronizedStart : synchronizedStop;
  return action();
}

module.exports = {
  update,
};
