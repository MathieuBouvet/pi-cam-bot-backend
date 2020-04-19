const errorHandler = require("./errorHandler");
const { Http400 } = require("./errors");

const res = {
  status: jest.fn(() => res),
  json: jest.fn(() => res),
};
const next = jest.fn();

afterEach(() => {
  res.status.mockClear();
  res.json.mockClear();
  next.mockClear();
});
it("should handle http 400 errors", () => {
  const http400Instance = new Http400("test http 400 error");
  errorHandler(http400Instance, null, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json.mock.calls[0][0]).toEqual({
    code: 400,
    reason: "Bad Request",
    message: "test http 400 error",
  });
  expect(next).not.toHaveBeenCalled();
});

it("should pass unhandled errors to default express error handler", () => {
  const defaultError = new Error("default error");
  errorHandler(defaultError, null, res, next);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledWith(defaultError);
});
