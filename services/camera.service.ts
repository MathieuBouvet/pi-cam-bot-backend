import streamer, { CameraStatus } from "../utils/streamerProcess";
import synchronizer from "../utils/synchronizer";

const withSynchronization = synchronizer();
const synchronizedStart = withSynchronization(streamer.start);
const synchronizedStop = withSynchronization(streamer.stop);

async function update(status: CameraStatus) {
  const action = status.started ? synchronizedStart : synchronizedStop;
  return action();
}

export default {
  update,
};
