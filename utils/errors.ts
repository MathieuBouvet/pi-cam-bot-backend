class Http400 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "400 - Bad Request";
  }
}

export { Http400 };
