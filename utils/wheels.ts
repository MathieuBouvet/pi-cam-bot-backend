import { Gpio } from "onoff";

export type wheel = [Gpio, Gpio];
export interface RobotWheels {
  left: wheel;
  right: wheel;
}
export interface Movement {
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

export function createMovement(...directions: (keyof Movement)[]): Movement {
  const movement: Movement = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  for (let direction of directions) {
    movement[direction] = true;
  }
  return movement;
}

const moveForward = createMovement("up");
const moveBackward = createMovement("down");
const moveLeft = createMovement("up", "left");
const moveRight = createMovement("up", "right");
const rotateLeft = createMovement("left");
const rotateRight = createMovement("right");

function isSame(d1: Movement, d2: Movement): boolean {
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

function getWheelsAction(movement: Movement): WheelsAction {
  if (isSame(movement, moveForward)) {
    return { left: forward, right: forward };
  }
  if (isSame(movement, moveBackward)) {
    return { left: backward, right: backward };
  }
  if (isSame(movement, moveLeft)) {
    return { left: nothing, right: forward };
  }
  if (isSame(movement, moveRight)) {
    return { left: forward, right: nothing };
  }
  if (isSame(movement, rotateLeft)) {
    return { left: backward, right: forward };
  }
  if (isSame(movement, rotateRight)) {
    return { left: forward, right: backward };
  }
  return { left: nothing, right: nothing };
}

export function gpiosToActivate(
  movement: Movement,
  wheels: RobotWheels
): Gpio[] {
  const actionsOn = getWheelsAction(movement);
  return [...actionsOn.left(wheels.left), ...actionsOn.right(wheels.right)];
}
