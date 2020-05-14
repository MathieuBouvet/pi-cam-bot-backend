import { mocked } from "ts-jest/utils";
import childProcess from "child_process";
import { EventEmitter } from "events";
import findProcess from "../utils/processFinder";

jest.mock("child_process");
const mockedChildProcess = mocked(childProcess, true);
let executed: EventEmitter = new EventEmitter();
mockedChildProcess.exec.mockImplementation((command, options, callback) => {
  if (callback) executed.on("exit", callback);
  return {} as childProcess.ChildProcess;
});

beforeEach(() => {
  mockedChildProcess.exec.mockClear();
});

it("should resolve with the pid of the found process", async () => {
  setTimeout(() => executed.emit("exit", null, "42 pts/2 S+ 0:00 testing"));
  await expect(findProcess("")).resolves.toBe(42);
});
it("should resolve to null if no process is found", async () => {
  setTimeout(() => executed.emit("exit", { code: 1 }, ""));
  await expect(findProcess("")).resolves.toBeNull();
});
it("should call the command to find a process", async () => {
  setTimeout(() => executed.emit("exit", null, "42 pts/2 S+ 0:00 testing"));
  await findProcess("process_name");
  expect(childProcess.exec).toHaveBeenCalledWith(
    "ps ax | grep -w process_name | grep -v grep",
    {},
    expect.any(Function)
  );
});
it("should reject with the error if there is an problem with the command", async () => {
  setTimeout(() => executed.emit("exit", { code: "other" }, ""));
  await expect(findProcess("")).rejects.toEqual({ code: "other" });
});
