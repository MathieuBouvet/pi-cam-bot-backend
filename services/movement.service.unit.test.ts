import { Gpio } from "onoff";
import { mocked } from "ts-jest/utils";
import movementService from "./movement.service";
import {
  gpiosToActivate,
  activate,
  deactivate,
  Movement,
} from "../utils/wheels";

jest.mock("../utils/wheels", () => ({
  __esModule: true,
  gpiosToActivate: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
}));

const mockedGpiosActivate = mocked(gpiosToActivate, true);
const mockedActivate = mocked(activate, true);
const mockedDeactivate = mocked(deactivate, true);

const passMove: Movement = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const testGpios = [
  new Gpio(11, "out"),
  new Gpio(13, "out"),
  new Gpio(23, "out"),
  new Gpio(24, "out"),
];

beforeEach(() => {
  mockedActivate.mockReset();
  mockedDeactivate.mockReset();
});
it.each([
  ["none", [], 0],
  ["one", [testGpios[0]], 1],
  ["one", [testGpios[1]], 1],
  ["one", [testGpios[2]], 1],
  ["one", [testGpios[3]], 1],
  ["two", [testGpios[0], testGpios[1]], 2],
  ["two", [testGpios[0], testGpios[2]], 2],
  ["three", [testGpios[0], testGpios[2], testGpios[3]], 3],
  ["four", [testGpios[0], testGpios[1], testGpios[2], testGpios[3]], 4],
])(
  "should deactivate every gpios and activate %p",
  (text, gpios, activateCallNumber) => {
    mockedGpiosActivate.mockReturnValueOnce(gpios);
    movementService.update(passMove);
    expect(mockedDeactivate).toHaveBeenCalledTimes(4);
    expect(mockedActivate).toHaveBeenCalledTimes(activateCallNumber);
  }
);
