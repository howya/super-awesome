const fs = require('fs');
const expect = require('chai').expect;
const { ReadStreamAdapter } = require('../../../src/adapters/stream/read-stream-adapter');

const expectedOrderedInput = require('../../fixtures/ordered-input-as-array');

describe('Stream Adapter Unit Tests', () => {
  describe('ReadStreamAdapter', () => {

    it('getAsyncStreamLineIterator is in order and complete when accessed asynchronously', async () => {

      // Open the test file as a stream and get the getAsyncStreamLineIterator iterator
      const filePath = `${__dirname}/../../fixtures/ordered-input.txt`;
      const fileStream = await fs.createReadStream(filePath);
      const readStreamAdapter = new ReadStreamAdapter(fileStream);
      const readStreamAsyncIterator = readStreamAdapter.getAsyncStreamLineIterator();

      // Iterate through each word in input iterator and push to array
      const receivedLines = [];
      for await (const line of readStreamAsyncIterator) {
        receivedLines.push(line);
      }

      // Expect that the file received in same order as test array
      expect(receivedLines).to.have.ordered.members(expectedOrderedInput);
    });

  });
});