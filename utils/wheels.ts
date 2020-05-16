import { Gpio } from "onoff";

export type wheel = [Gpio, Gpio];
export interface RobotWheels {
  left: wheel;
  right: wheel;
}
export interface Directions {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}
interface actionOnWheel {
  (wheel: wheel): Gpio[];
}
type WheelsAction = {
  [key in keyof RobotWheels]: actionOnWheel;
};

function createDirections(...directions: (keyof Directions)[]): Directions {
  const dir: Directions = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  for (let name of directions) {
    dir[name] = true;
  }
  return dir;
}

const moveForward = createDirections("up");
const moveBackward = createDirections("down");
const rotateLeft = createDirections("left");
const rotateRight = createDirections("right");

function isSame(d1: Directions, d2: Directions): boolean {
  return (
    d1.up === d2.up &&
    d1.down === d2.down &&
    d1.left === d2.left &&
    d1.right === d2.right
  );
}

function activate(gpio: Gpio): void {
  gpio.writeSync(1);
}

function deactivate(gpio: Gpio): void {
  gpio.writeSync(0);
}

const nothing: actionOnWheel = (wheel) => [];
const forward: actionOnWheel = (wheel) => [wheel[0]];
const backward: actionOnWheel = (wheel) => [wheel[1]];

function getWheelsAction({ up, down, left, right }: Directions): WheelsAction {
  if (up) {
    return { left: forward, right: forward };
  }
  if (down) {
    return { left: backward, right: backward };
  }
  if (left) {
    return { left: backward, right: forward };
  }
  if (right) {
    return { left: forward, right: backward };
  }
  return { left: nothing, right: nothing };
}

export function gpiosToActivate(
  directions: Directions,
  wheels: RobotWheels
): Gpio[] {
  const actionsOn = getWheelsAction(directions);
  return [...actionsOn.left(wheels.left), ...actionsOn.right(wheels.right)];
}
