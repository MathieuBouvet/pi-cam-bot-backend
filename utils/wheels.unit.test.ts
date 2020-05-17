import { Gpio } from "onoff";
import {
  gpiosToActivate,
  RobotWheels,
  Movement,
  createMovement,
} from "./wheels";

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

it.each<[string, (keyof Movement)[], Gpio[]]>([
  ["move forward", ["up"], [testGpios[0], testGpios[2]]],
  ["move backward", ["down"], [testGpios[1], testGpios[3]]],
  ["move left", ["up", "left"], [testGpios[2]]],
  ["move right", ["up", "right"], [testGpios[0]]],
  ["rotate left", ["left"], [testGpios[1], testGpios[2]]],
  ["rotate right", ["right"], [testGpios[0], testGpios[3]]],
  ["go backward left", ["down", "left"], [testGpios[3]]],
  ["go backward right", ["down", "right"], [testGpios[1]]],
])(
  "should return the list of gpio to activate to %s",
  (description, directions, expected: Gpio[]) => {
    const movement = createMovement(...directions);
    expect(gpiosToActivate(movement, testRobotWheels)).toEqual(expected);
  }
);

it.each<[string, (keyof Movement)[]]>([
  ["UP and DOWN", ["up", "down"]],
  ["LEFT and RIGHT", ["left", "right"]],
  ["UP and DOWN and LEFT", ["up", "down", "left"]],
  ["DOWN and LEFT and RIGHT", ["down", "left", "right"]],
  ["UP and LEFT and RIGHT", ["up", "left", "right"]],
  ["UP and DOWN and RIGHT", ["up", "down", "right"]],
  ["all at once", ["up", "down", "left", "right"]],
  ["none", []],
])("should return empty list for %s", (description, directions) => {
  const movement = createMovement(...directions);
  expect(gpiosToActivate(movement, testRobotWheels)).toEqual([]);
});
