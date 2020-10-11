const chai = require('chai');
const chaiSubset = require('chai-subset');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(chaiSubset);

describe('End to End Tests', () => {
  describe('some test - check wording', () => {

    before(async function () {
    });

    afterEach(async function () {
    });

    it('', async () => {});

  });
});