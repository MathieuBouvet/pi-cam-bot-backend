import { Gpio } from "onoff";
import { gpiosToActivate, RobotWheels, Movement } from "./wheels";

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
  [
    "move backward",
    {
      up: false,
      down: true,
      left: false,
      right: false,
    },
    [testGpios[1], testGpios[3]],
  ],
  [
    "move left",
    {
      up: true,
      down: false,
      left: true,
      right: false,
    },
    [testGpios[2]],
  ],
  [
    "move right",
    {
      up: true,
      down: false,
      left: false,
      right: true,
    },
    [testGpios[0]],
  ],
  [
    "rotate left",
    {
      up: false,
      down: false,
      left: true,
      right: false,
    },
    [testGpios[1], testGpios[2]],
  ],
  [
    "rotate right",
    {
      up: false,
      down: false,
      left: false,
      right: true,
    },
    [testGpios[0], testGpios[3]],
  ],
])(
  "should return the list of gpio to activate to %s",
  (description: string, movement: Movement, expected: Gpio[]) => {
    expect(gpiosToActivate(movement, testRobotWheels)).toEqual(expected);
  }
);

it.each([
  [
    "UP and DOWN",
    {
      up: true,
      down: true,
      left: false,
      right: false,
    },
  ],
  [
    "LEFT and RIGHT",
    {
      up: false,
      down: false,
      left: true,
      right: true,
    },
  ],
  [
    "DOWN and LEFT",
    {
      up: false,
      down: true,
      left: true,
      right: false,
    },
  ],
  [
    "DOWN and RIGHT",
    {
      up: false,
      down: true,
      left: false,
      right: true,
    },
  ],
  [
    "UP and DOWN and LEFT",
    {
      up: true,
      down: true,
      left: true,
      right: false,
    },
  ],
  [
    "DOWN and LEFT and RIGHT",
    {
      up: false,
      down: true,
      left: true,
      right: true,
    },
  ],
  [
    "UP and LEFT and RIGHT",
    {
      up: true,
      down: false,
      left: true,
      right: true,
    },
  ],
  [
    "UP and DOWN and RIGHT",
    {
      up: true,
      down: true,
      left: false,
      right: true,
    },
  ],
  [
    "UP and DOWN and LEFT",
    {
      up: true,
      down: true,
      left: true,
      right: false,
    },
  ],
  [
    "all at once",
    {
      up: true,
      down: true,
      left: true,
      right: true,
    },
  ],
  [
    "none",
    {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  ],
])(
  "should return empty list for %s",
  (description: string, movement: Movement) => {
    expect(gpiosToActivate(movement, testRobotWheels)).toEqual([]);
  }
);
