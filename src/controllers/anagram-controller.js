const { ReadStreamAdapter } = require('../adapters/stream/read-stream-adapter');
const { WriteStreamAdapter } = require('../adapters/stream/write-stream-adapter');
const { ControllerError } = require('./errors/controller-error');
const { AnagramGroup } = require('../services/anagram-group');

/**
 * Controller class for processing Anagrams from stream
 * @type {AnagramController}
 */
module.exports.AnagramController = class {
  /**
   * Processes the stream of anagrams from input stream
   * and present in output stream
   *
   * input: https://nodejs.org/api/stream.html#stream_class_stream_readable
   * output: https://nodejs.org/api/stream.html#stream_class_stream_writeable
   * @returns {Promise<void>}
   * @throws ControllerError
   * @param inputStream
   * @param outputStream
   */
  static async processAnagramStream(inputStream, outputStream) {
    // Note, we do not validate streams here, it is validated on
    // StreamAdapter construction
    try {
      const readStreamAdapter = new ReadStreamAdapter(inputStream);
      const writeStreamAdapter = new WriteStreamAdapter(outputStream);
      const readStreamAsyncIterator = readStreamAdapter.getAsyncStreamLineIterator();
      const anagramGroup = new AnagramGroup();

      // Iterate through each word in input iterator and pass to checkAnagram
      for await (const line of readStreamAsyncIterator) {
        writeStreamAdapter.writeArrayOfStringsToSteam(
          anagramGroup.checkAnagram(line),
        );
      }

      // Get last set of groups after input ended (if there are any)
      writeStreamAdapter.writeArrayOfStringsToSteam(
        anagramGroup.getGroupsAsArrayOfGroupedStrings(),
      );
    } catch (err) {
      throw new ControllerError(
        'AnagramController.processAnagramStream failed',
        err,
      );
    }
  }
};
