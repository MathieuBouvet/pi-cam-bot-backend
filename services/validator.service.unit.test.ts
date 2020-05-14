import validator from "./validator.service";
import { Http400 } from "../utils/errors";

describe("camera validator", () => {
  const cameraValidator = validator.camera;
  it.each([[{ started: true }], [{ started: false }]])(
    "should return the input when passing validation",
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
  ])(
    "should throw an Http400 error when input is not {started: Boolean}",
    (input) => {
      expect(() => cameraValidator(input)).toThrow(Http400);
    }
  );
});
