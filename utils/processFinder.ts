import { exec } from "child_process";

const processFinder: (name: string) => Promise<number | null> = (
  name: string
): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    exec(`ps ax | grep -w ${name} | grep -v grep`, {}, (err, stdout) => {
      if (err) {
        return err.code === 1 ? resolve(null) : reject(err);
      }
      const firstResult = stdout.split("\n").filter((line) => line !== "")[0];
      const pid = firstResult.trim().split(" ")[0];
      resolve(parseInt(pid));
    });
  });
};

export default processFinder;
