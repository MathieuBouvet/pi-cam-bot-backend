class Http400 extends Error {
  constructor(message) {
    super(message);
    this.name = "400 - Bad Request";
  }
}

module.exports = {
  Http400,
};
