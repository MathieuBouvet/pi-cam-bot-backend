const { exec } = require("child_process");
module.exports = (name) => {
  return new Promise((resolve, reject) => {
    exec(`ps ax | grep -w ${name} | grep -v grep`, (err, stdout) => {
      if (err) {
        return err.code === 1 ? resolve(null) : reject(err);
      }
      const firstResult = stdout.split("\n").filter((line) => line !== "")[0];
      const pid = firstResult.trim().split(" ")[0];
      resolve(parseInt(pid));
    });
  });
};
