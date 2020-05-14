import { Http400 } from "./errors";

describe("Http400 error", () => {
  const http400Instance = new Http400("test http 400");
  it("should be an instance of Error", () => {
    expect(http400Instance).toBeInstanceOf(Error);
  });
  it("should be named 400 - Bad Request", () => {
    expect(http400Instance.name).toBe("400 - Bad Request");
  });
  it("should set its message correctly", () => {
    expect(http400Instance.message).toBe("test http 400");
  });
});
