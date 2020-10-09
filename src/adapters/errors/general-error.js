module.exports.AdapterGeneralError = class extends Error {
  constructor(message, childError) {
    super(message);
    this.name = 'AdapterGeneralError';
    this.childError = childError;
  }
};
