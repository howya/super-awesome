const stream = require('stream');
const { AdapterValidationError } = require('../errors/validation-error');
const { AdapterGeneralError } = require('../errors/general-error');

/**
 * Simple write stream adapter class
 *
 * Ideally this would extend a BaseStreamAdapter class,
 * but with these trivial example classes, there is no common stream
 * functionality
 *
 * @type {WriteStreamAdapter}
 */
module.exports.WriteStreamAdapter = class {
  /**
   * Construct with instance of writable stream
   * https://nodejs.org/api/stream.html#stream_class_stream_writable
   * @param targetStream
   * @throws AdapterValidationError
   */
  constructor(targetStream) {
    // Validate that the output stream is a writable stream
    if (!(targetStream instanceof stream.Stream
      && typeof (targetStream._write === 'function')
      && typeof (targetStream._writeableState === 'object'))) {
      throw new AdapterValidationError('WriteStreamAdapter.constructor targetStream not writable stream');
    }
    this.stream = targetStream;
  }

  /**
   *
   * @param stringArray
   * @returns {*}
   * @throws AdapterGeneralError
   */
  writeArrayOfStringsToSteam(stringArray) {
    try {
      return stringArray.map(
        (eachString) => this.writeToStream(eachString),
      );
    } catch (err) {
      throw new AdapterGeneralError(
        'WriteStreamAdapter.writeArrayOfStringsToSteam failed',
        err,
      );
    }
  }

  /**
   *
   * @param stringToWrite
   * @returns {void|undefined|string|*|PromiseLike<void>|Promise<void>}
   * @throws AdapterGeneralError
   */
  writeToStream(stringToWrite) {
    try {
      return this.stream.write(`${stringToWrite}\n`);
    } catch (err) {
      throw new AdapterGeneralError(
        'WriteStreamAdapter.writeToStream failed',
        err,
      );
    }
  }
};
