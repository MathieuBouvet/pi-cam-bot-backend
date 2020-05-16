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

function activate(gpio: Gpio): void {
  gpio.writeSync(1);
}

function deactivate(gpio: Gpio): void {
  gpio.writeSync(0);
}

const nothing: actionOnWheel = (wheel) => [];
const forward: actionOnWheel = (wheel) => [wheel[0]];

function getWheelsAction({ up, down, left, right }: Directions): WheelsAction {
  if (up) {
    return { left: forward, right: forward };
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
