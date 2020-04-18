const { Http400 } = require("../utils/errors");
function camera(input) {
  if (
    input &&
    input.started != null &&
    typeof input.started == "boolean" &&
    Object.keys(input).length === 1
  ) {
    return input;
  }
  throw new Http400("invalid camera input");
}
module.exports = {
  camera,
};
