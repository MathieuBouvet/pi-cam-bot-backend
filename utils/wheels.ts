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

function activate(gpio: Gpio): void {
  gpio.writeSync(1);
}

function deactivate(gpio: Gpio): void {
  gpio.writeSync(0);
}

export function gpiosToActivate(
  directions: Directions,
  wheels: RobotWheels
): Gpio[] {
  return [];
}
