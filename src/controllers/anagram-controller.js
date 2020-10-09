const { StreamAdapter } = require('../adapters/stream-adapter');
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
      const streamAdapter = new StreamAdapter(stream);
      const streamAsyncIterator = streamAdapter.getAsyncStreamLineIterator();
      const anagramGroup = new AnagramGroup();

      // Iterate through each word in input iterator and pass to checkAnagram
      for await (const line of streamAsyncIterator) {
        outputArrayOfStringsToStdOut(anagramGroup.checkAnagram(line));
      }

      // Get last set of groups after input ended (if there are any)
      outputArrayOfStringsToStdOut(anagramGroup.getGroupsAsArrayOfGroupedStrings());
    } catch (err) {
      throw new ControllerError(
        'AnagramController.processAnagramStream failed',
        err,
      );
    }
  }
};

const outputArrayOfStringsToStdOut = (stringArray) => {
  if (!stringArray) return false;
  stringArray.forEach(
    (groupString) => process.stdout.write(`${groupString}\n`),
  );
  return true;
};
