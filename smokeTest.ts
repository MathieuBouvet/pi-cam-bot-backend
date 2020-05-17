import supertest from "supertest";
import app from "./app";
import waitFor from "./utils/waitFor";
import { createMovement } from "./utils/wheels";

const request = supertest(app);
const moveURI = "/robot/movement";

const oneSecond = waitFor(1000);

const stop = createMovement();
const moveForward = createMovement("up");
const moveBackward = createMovement("down");
const rotateLeft = createMovement("left");
const rotateRight = createMovement("right");

/**
 * the robot should :
 *  move forward for one second,
 *  rotate left for one second,
 *  rotate right for one second,
 *  move backward for one second,
 *  and stop.
 */

(async () => {
  await request.put(moveURI).send(moveForward);
  await oneSecond();
  await request.put(moveURI).send(stop);
  await oneSecond();

  await request.put(moveURI).send(rotateLeft);
  await oneSecond();
  await request.put(moveURI).send(stop);
  await oneSecond();

  await request.put(moveURI).send(rotateRight);
  await oneSecond();
  await request.put(moveURI).send(stop);
  await oneSecond();

  await request.put(moveURI).send(moveBackward);
  await oneSecond();

  await request.put(moveURI).send(stop);
})();
