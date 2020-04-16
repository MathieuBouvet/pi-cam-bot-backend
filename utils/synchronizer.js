function synchronizer() {
  let idle = true;
  const awaiting = [];

  const beeingIdle = async () => {
    if (idle) {
      idle = false;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      awaiting.push(resolve);
    });
  };

  const taskFinished = () => {
    if (awaiting.length === 0) {
      idle = true;
    } else {
      const resolveNextAwaiting = awaiting.shift();
      resolveNextAwaiting();
    }
  };

  return function withSynchronization(action) {
    return async () => {
      await beeingIdle();
      try {
        const result = await action();
        return result;
      } finally {
        taskFinished();
      }
    };
  };
}

module.exports = synchronizer;
