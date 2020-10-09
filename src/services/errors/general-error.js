module.exports.ServiceGeneralError = class extends Error {
  constructor(message, childError) {
    super(message);
    this.name = 'ServiceGeneralError';
    this.childError = childError;
  }
};
