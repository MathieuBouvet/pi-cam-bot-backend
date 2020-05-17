import supertest from "supertest";
import app from "./app";
import waitFor from "./utils/waitFor";

const request = supertest(app);
const moveURI = "/robot/movement";

const oneSecond = waitFor(1000);

/**
 * the robot should :
 *  move forward for one second,
 *  rotate left for one second,
 *  rotate right for one second,
 *  move backward for one second,
 *  and stop.
 */

(async () => {
  await request.put(moveURI).send({
    up: true,
    down: false,
    left: false,
    right: false,
  });
  await oneSecond();

  await request.put(moveURI).send({
    up: false,
    down: false,
    left: true,
    right: true,
  });
  await oneSecond();

  await request.put(moveURI).send({
    up: false,
    down: false,
    left: false,
    right: true,
  });
  await oneSecond();

  await request.put(moveURI).send({
    up: false,
    down: true,
    left: false,
    right: false,
  });
  await oneSecond();

  await request.put(moveURI).send({
    up: false,
    down: false,
    left: false,
    right: false,
  });
})();
