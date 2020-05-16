import { Gpio } from "onoff";
import { gpiosToActivate, RobotWheels, Directions } from "./wheels";

const testGpios = [
  new Gpio(11, "out"),
  new Gpio(13, "out"),
  new Gpio(23, "out"),
  new Gpio(24, "out"),
];

const testRobotWheels: RobotWheels = {
  left: [testGpios[0], testGpios[1]],
  right: [testGpios[2], testGpios[3]],
};

it.each([
  [
    "move forward",
    {
      up: true,
      down: false,
      left: false,
      right: false,
    },
    [testGpios[0], testGpios[2]],
  ],
])(
  "should return the list of gpio to activate to %s",
  (description: string, directions: Directions, expected: Gpio[]) => {
    expect(gpiosToActivate(directions, testRobotWheels)).toEqual(expected);
  }
);
