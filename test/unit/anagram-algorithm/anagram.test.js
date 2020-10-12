const chai = require('chai');
const { expect } = chai;
const { AnagramGroup } = require('../../../src/services/anagram-group');
const { ServiceGeneralError } = require('../../../src/services/errors/general-error');
const { makeString } = require('../../helpers/string');
const {
  groupOfThree,
  groupOfFour,
} = require('../../fixtures/anagram-groups');


describe('Anagram Group Class Unit Tests', () => {
  describe('Validation', () => {

    it('checkAnagram throws an error if word parameter is not a string', async () => {
      const anagramGroup = new AnagramGroup();

      expect(function() {anagramGroup.checkAnagram({})}).to.throw(ServiceGeneralError);
    });

    it('checkAnagram throws an error if word is empty string', async () => {
      const anagramGroup = new AnagramGroup();

      expect(function() {anagramGroup.checkAnagram('')}).to.throw(ServiceGeneralError);
    });

    it('checkAnagram throws an error if word parameter contains whitespace', async () => {
      const anagramGroup = new AnagramGroup();

      expect(function() {anagramGroup.checkAnagram('test ')}).to.throw(ServiceGeneralError);
    });

    it('checkAnagram throws an error if word parameter contains hyphen', async () => {
      const anagramGroup = new AnagramGroup();

      expect(function() {anagramGroup.checkAnagram('t-est')}).to.throw(ServiceGeneralError);
    });

    it('checkAnagram throws an error if word parameter shorter in length than previous call', async () => {
      const anagramGroup = new AnagramGroup();

      // Place a word of length 3
      anagramGroup.checkAnagram('abc');

      // Expect an error on length 2
      expect(function() {anagramGroup.checkAnagram('ab')}).to.throw(ServiceGeneralError);
    });

  });

  describe('Expected Output Tests', () => {

    it('checkAnagram returns empty array while input of same length', async () => {
      const anagramGroup = new AnagramGroup();

      for ( let i = 0; i < 10; i++ ) {
        expect(
          anagramGroup.checkAnagram(makeString(10))
        ).to.be.an('array').that.is.empty;
      }
    });

    it('checkAnagram returns empty array while input of same length', async () => {
      const anagramGroup = new AnagramGroup();

      for ( let i = 0; i < 10; i++ ) {
        expect(
          anagramGroup.checkAnagram(makeString(10))
        ).to.be.an('array').that.is.empty;
      }
    });

    it('checkAnagram returns results for previous length group (single group found) when new greater length word presented', async () => {
      const anagramGroup = new AnagramGroup();

      // Build the array of same length words
      groupOfThree.input.forEach(word => {
        expect(
          anagramGroup.checkAnagram(word)
        ).to.be.an('array').that.is.empty;
      });

      // Add a longer word to trigger the output
      expect(
        anagramGroup.checkAnagram('four')
      ).to.have.members([groupOfThree.output.join(', ')]);
    });

    it('checkAnagram returns results for next length group (single group found) when new greater length word presented', async () => {
      const anagramGroup = new AnagramGroup();

      // Build the array of same length words
      groupOfThree.input.forEach(word => {
        expect(
          anagramGroup.checkAnagram(word)
        ).to.be.an('array').that.is.empty;
      });

      // Add a longer word to trigger the output
      expect(
        anagramGroup.checkAnagram('zbcd') // this will not belong to any in the next group
      ).to.have.members([groupOfThree.output.join(', ')]);

      // Build the array of next length words
      groupOfFour.input.forEach(word => {
        expect(
          anagramGroup.checkAnagram(word)
        ).to.be.an('array').that.is.empty;
      });

      // Add a longer word to trigger the output
      expect(
        anagramGroup.checkAnagram('abcde')
      ).to.have.members([groupOfFour.output.join(', ')]);
    });

  });

  describe('checkAnagram supporting method tests', () => {

    it('cleanseWord returns correctly ordered and lowercase word', async () => {
      const anagramGroup = new AnagramGroup();

        expect(
          anagramGroup.cleanseWord('ZXcvBnm')
        ).to.equal('bcmnvxz');
    });

    it('mapToArrayOfStrings returns empty array when map has no keys', async () => {
      const anagramGroup = new AnagramGroup();

      const map = new Map();

      expect(
        anagramGroup.mapToArrayOfStrings(map, 1)
      ).to.be.an('array').that.is.empty;
    });

    it('mapToArrayOfStrings transforms only keys with array length >= groupSize', async () => {
      const anagramGroup = new AnagramGroup();

      const map = new Map();
      map.set('abc', ['cba']);
      map.set('bcd', ['dcb','cba']);
      map.set('ccd', ['cde','edc', 'dec']);
      map.set('xyz', ['xyz']);

      expect(
        anagramGroup.mapToArrayOfStrings(map, 2)
      ).to.have.members(['dcb, cba', 'cde, edc, dec']);
    });

    it('groupedByCleansedWordMap transforms empty grouping array to empty map', async () => {
      const anagramGroup = new AnagramGroup();

      const array = [];

      expect(
        [...anagramGroup.groupedByCleansedWordMap(array)]
      ).to.be.an('array').that.is.empty;
    });

    it('groupedByCleansedWordMap transforms grouping array to correct map', async () => {
      const anagramGroup = new AnagramGroup();

      const array = [
        {
          cleansed: anagramGroup.cleanseWord('BCD'),
          clear: 'BCD',
        },
        {
          cleansed: anagramGroup.cleanseWord('cbd'),
          clear: 'cbd',
        },
        {
          cleansed: anagramGroup.cleanseWord('Dcb'),
          clear: 'Dcb',
        },
        {
          cleansed: anagramGroup.cleanseWord('ABC'),
          clear: 'ABC',
        },
      ]

      expect(
        [...anagramGroup.groupedByCleansedWordMap(array)]
      ).to.have.deep.members([ [ 'bcd', [ 'BCD', 'cbd', 'Dcb' ] ], [ 'abc', [ 'ABC' ] ] ]);
    });

  });
});