import validator from "./validator.service";
import { Http400 } from "../utils/errors";
import { createMovement } from "../utils/wheels";

describe("camera validator", () => {
  const cameraValidator = validator.camera;
  it.each([[{ started: true }], [{ started: false }]])(
    "%p should pass validation",
    (value) => {
      expect(cameraValidator(value)).toEqual(value);
    }
  );
  it.each([
    [null],
    [42],
    ["42"],
    [() => null],
    [[]],
    [true],
    [{ invalid: true }],
    [{ started: 42 }],
    [{ started: "42" }],
    [{ started: null }],
    [{ started: undefined }],
    [{ started: () => null }],
    [{ started: [] }],
    [{ started: true, invalid: false }],
  ])("%p should not pass validation", (input) => {
    expect(() => cameraValidator(input)).toThrow(Http400);
  });
});

describe("movement validator", () => {
  it.each([
    [createMovement()],
    [createMovement("up")],
    [createMovement("down")],
    [createMovement("left")],
    [createMovement("right")],
    [createMovement("up", "down")],
    [createMovement("up", "left")],
    [createMovement("up", "right")],
    [createMovement("down", "left")],
    [createMovement("down", "right")],
    [createMovement("left", "right")],
    [createMovement("up", "down", "left")],
    [createMovement("up", "down", "right")],
    [createMovement("up", "left", "right")],
    [createMovement("down", "left", "right")],
    [createMovement("up", "down", "left", "right")],
  ])("%p should pass validation", (input) => {
    expect(validator.movement(input)).toEqual(input);
  });

  it.each([
    [null],
    [{}],
    [{ up: true }],
    [{ up: "true" }],
    [{ up: true, down: true, left: true, plop: true }],
    [{ up: "", down: "", left: "", right: "" }],
    [{ up: true, down: true, left: true, right: true, plop: true }],
  ])("%p should not pass validation", (input) => {
    expect(() => validator.movement(input)).toThrow(Http400);
  });
});
