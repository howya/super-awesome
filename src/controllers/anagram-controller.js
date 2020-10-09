const { ReadStreamAdapter } = require('../adapters/read-stream-adapter');
const { WriteStreamAdapter } = require('../adapters/write-stream-adapter');
const { ControllerError } = require('./errors/controller-error');
const { AnagramGroup } = require('../services/anagram-group');

/**
 * Controller class for processing Anagrams from stream
 * @type {AnagramController}
 */
module.exports.AnagramController = class {
  /**
   * Processes the stream of anagrams
   * @param stream instance of readable stream
   * https://nodejs.org/api/stream.html#stream_class_stream_readable
   * @returns {Promise<void>}
   * @throws ControllerError
   */
  static async processAnagramStream(stream) {
    // Note, we do not validate stream here, it is validated on
    // StreamAdapter construction
    try {
      const readStreamAdapter = new ReadStreamAdapter(stream);
      const writeStreamAdapter = new WriteStreamAdapter(process.stdout);
      const readStreamAsyncIterator = readStreamAdapter.getAsyncStreamLineIterator();
      const anagramGroup = new AnagramGroup();
      let checkAnagramResult;

      // Iterate through each word in input iterator and pass to checkAnagram
      for await (const line of readStreamAsyncIterator) {
        checkAnagramResult = anagramGroup.checkAnagram(line);
        // If checkAnagram returns result then send to stream
        if (checkAnagramResult !== false) {
          writeStreamAdapter.writeArrayOfStringsToSteam(checkAnagramResult);
        }
      }

      // Get last set of groups after input ended (if there are any)
      checkAnagramResult = anagramGroup.getGroupsAsArrayOfGroupedStrings();
      // If getGroupsAsArrayOfGroupedStrings returns result then send to stream
      if (checkAnagramResult !== false) {
        writeStreamAdapter.writeArrayOfStringsToSteam(checkAnagramResult);
      }
    } catch (err) {
      throw new ControllerError(
        'AnagramController.processAnagramStream failed',
        err,
      );
    }
  }
};
