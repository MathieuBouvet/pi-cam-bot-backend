import { Http400 } from "../utils/errors";
import { CameraStatus } from "../utils/streamerProcess";
import { Movement } from "../utils/wheels";

function isCameraStatus(input: any): input is CameraStatus {
  return input != null && typeof input.started === "boolean";
}

function isMovement(input: any): input is Movement {
  if (input == null) {
    return false;
  }
  const casted = input as Movement;
  return (
    typeof casted.up === "boolean" &&
    typeof casted.down === "boolean" &&
    typeof casted.left === "boolean" &&
    typeof casted.right === "boolean"
  );
}

function camera(input: any): CameraStatus {
  if (!isCameraStatus(input) || Object.keys(input).length !== 1) {
    throw new Http400("invalid camera input");
  }
  return input;
}

function movement(input: any): Movement {
  if (!isMovement(input) || Object.keys(input).length !== 4) {
    throw new Http400("invalid movement input");
  }
  return input;
}
export default {
  camera,
  movement,
};
