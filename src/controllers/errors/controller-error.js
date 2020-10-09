module.exports.ControllerError = class extends Error {
  constructor(message, childError) {
    super(message);
    this.name = 'ControllerError';
    this.childError = childError;
  }
};
