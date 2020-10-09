module.exports.AdapterValidationError = class extends Error {
  constructor(message, childError) {
    super(message);
    this.name = 'AdapterValidationError';
    this.childError = childError;
  }
};
