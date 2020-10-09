module.exports.ServiceValidationError = class extends Error {
  constructor(message, childError) {
    super(message);
    this.name = 'ServiceValidationError';
    this.childError = childError;
  }
};
