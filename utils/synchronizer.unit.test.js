const synchronizer = require("./synchronizer");
const withSynchronization = synchronizer();

describe("the synchronizer", () => {
  it("should return a function", () => {
    expect(withSynchronization).toBeInstanceOf(Function);
  });
});

const resolvedPromiseFactory = (timing = 150) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ controlValue: 42, resolvedAt: Date.now() });
    }, timing);
  });
};

const rejectedPromiseFactory = (timing = 150) => () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({ controlValue: "rejected", rejectedAt: Date.now() });
    }, timing);
  });
};
describe("the synchronization function", () => {
  it("should resolve to the resolved value of its parameter", async () => {
    const result = withSynchronization(resolvedPromiseFactory())();
    await expect(result).resolves.toMatchObject({ controlValue: 42 });
  });
  it("should reject with the reason from its parameter", async () => {
    const result = withSynchronization(rejectedPromiseFactory())();
    await expect(result).rejects.toMatchObject({ controlValue: "rejected" });
  });
  it("should synchronize multiple calls", async () => {
    const calls = await Promise.all([
      withSynchronization(resolvedPromiseFactory())(),
      withSynchronization(resolvedPromiseFactory(20))(),
      withSynchronization(resolvedPromiseFactory(150))(),
      withSynchronization(resolvedPromiseFactory(50))(),
      withSynchronization(resolvedPromiseFactory(200))(),
    ]);
    expect(calls[0].resolvedAt + 20).toBeLessThanOrEqual(calls[1].resolvedAt);
    expect(calls[1].resolvedAt + 150).toBeLessThanOrEqual(calls[2].resolvedAt);
    expect(calls[2].resolvedAt + 50).toBeLessThanOrEqual(calls[3].resolvedAt);
    expect(calls[3].resolvedAt + 200).toBeLessThanOrEqual(calls[4].resolvedAt);
  });
  it("should synchronize multple calls even if some rejects", async () => {
    const promises = [
      withSynchronization(resolvedPromiseFactory())(),
      withSynchronization(resolvedPromiseFactory(20))(),
      withSynchronization(rejectedPromiseFactory(150))().catch((e) => e),
      withSynchronization(resolvedPromiseFactory(50))(),
      withSynchronization(resolvedPromiseFactory(200))(),
    ];
    const calls = await Promise.all(promises);
    expect(calls[0].resolvedAt + 20).toBeLessThanOrEqual(calls[1].resolvedAt);
    expect(calls[1].resolvedAt + 150).toBeLessThanOrEqual(calls[2].rejectedAt);
    expect(calls[2].rejectedAt + 50).toBeLessThanOrEqual(calls[3].resolvedAt);
    expect(calls[3].resolvedAt + 200).toBeLessThanOrEqual(calls[4].resolvedAt);
  });
});
