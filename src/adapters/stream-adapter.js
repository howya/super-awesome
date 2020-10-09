const readline = require('readline');
const stream = require('stream');
const { AdapterValidationError } = require('./errors/validation-error');
const { AdapterGeneralError } = require('./errors/general-error');

/**
 * Simple stream adapter class
 * @type {StreamAdapter}
 */
module.exports.StreamAdapter = class {
  /**
   * Construct with instance of readable stream
   * https://nodejs.org/api/stream.html#stream_class_stream_readable
   * @param targetStream
   * @throws AdapterValidationError
   */
  constructor(targetStream) {
    /*
    Validate that the input stream is a readable stream
    This should be extended if this adapter were extended
    to support stream writing
    */
    if (!(targetStream instanceof stream.Stream
      && typeof (targetStream._read === 'function')
      && typeof (targetStream._readableState === 'object'))) {
      throw new AdapterValidationError('StreamAdapter.constructor targetStream not readable stream');
    }
    this.stream = targetStream;
  }

  /**
   * Returns an async iterator for the
   * constructed stream
   * @returns {readline.Interface}
   * @throws AdapterGeneralError
   */
  getAsyncStreamLineIterator() {
    try {
      return readline.createInterface({
        input: this.stream,
      });
    } catch (err) {
      throw new AdapterGeneralError(
        'StreamAdapter.getAsyncStreamLineIterator failed',
        err,
      );
    }
  }
};
