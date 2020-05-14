import { Http400 } from "../utils/errors";
import { CameraStatus } from "../utils/streamerProcess";

function camera(input: any): CameraStatus {
  if (
    input &&
    input.started != null &&
    typeof input.started == "boolean" &&
    Object.keys(input).length === 1
  ) {
    return input as CameraStatus;
  }
  throw new Http400("invalid camera input");
}
export default {
  camera,
};
