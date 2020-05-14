interface Synchronizer {
  <T>(action: () => Promise<T>): () => Promise<T>;
}
function synchronizer(): Synchronizer {
  let idle = true;
  const awaiting: (() => void)[] = [];

  const beeingIdle = async () => {
    if (idle) {
      idle = false;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      awaiting.push(resolve);
    });
  };

  const taskFinished = () => {
    const resolveNextAwaiting = awaiting.shift();
    if (resolveNextAwaiting != null) {
      resolveNextAwaiting();
    } else {
      idle = true;
    }
  };

  return function withSynchronization(action) {
    return async () => {
      await beeingIdle();
      try {
        return await action();
      } finally {
        taskFinished();
      }
    };
  };
}

export default synchronizer;
