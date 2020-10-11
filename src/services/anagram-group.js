const { ServiceGeneralError } = require('./errors/general-error');
const { ServiceValidationError } = require('./errors/validation-error');

/* eslint class-methods-use-this: [
  "error", { "exceptMethods": ["mapToArrayOfStrings","cleanseWord","groupedByCleansedWordMap"] }
] */
/**
 * Processes words passed in ascending order of length into groups
 * that are related by having the same letters (anagrams).
 *
 * To process a new word, call checkAnagram(word)
 *
 * Once all words have been processed, call getGroupsAsArrayOfGroupedStrings()
 * to get any remaining groups
 *
 * @type {AnagramGroup}
 */
module.exports.AnagramGroup = class {
  /**
   * Instantiate the empty groupedByLengthArray
   */
  constructor() {
    this.groupedByLengthArray = [];
  }

  /**
   * With each word passed, if the word is the first word, or the same
   * length as the previous word passed, then persist the word in the
   * local groupedByLengthArray. The empty array is returned to indicate
   * that group processing is not yet complete (the next word could be
   * of the same length and potentially belong in the current group).
   *
   * If the word passed is smaller than the previous word then an error
   * is thrown as the input is not ordered in length ascending.
   *
   * Finally, if the word length is greater than the previous word passed,
   * then return an array of all anagram group strings for the previous length
   * and start a new group with word passed.
   *
   * @param word
   * @returns {Array}
   * @throws ServiceGeneralError
   */
  checkAnagram(word) {
    try {
      // Ensure word is a string without white space
      if (typeof word !== 'string' || /\s/.test(word)) {
        throw new ServiceValidationError(
          `input not a string, or contains whitespace, typeof: ${typeof word}`,
        );
      }

      // For a word, cleanse it and construct an object that
      // maps the cleansed word to the 'clear' word
      const wordMap = {
        cleansed: this.cleanseWord(word),
        clear: word,
      };

      // If the groupArray is empty then we have
      // nothing to compare. Push onto the array and
      // return [] to indicate there is not a complete group yet
      if (this.groupedByLengthArray.length < 1) {
        this.groupedByLengthArray.push(wordMap);
        return [];
      }

      // If  the word length is smaller than the words in groupedByLengthArray
      // The throw error as input file not ordered ascending
      if (this.getGroupedByLengthArrayWordLength() > word.length) {
        throw new ServiceValidationError(`input not ordered length ascending at: ${word}`);
      }

      // If the word is the same length as the cleansed
      // words in the current group then push to the group
      if (this.getGroupedByLengthArrayWordLength() === word.length) {
        this.groupedByLengthArray.push(wordMap);
        return [];
      }

      // Otherwise, if not the same length then we are starting a new
      // group (as per assumption / examples that input is ordered length asc).
      // so get the existing group plain words as an array string
      const currentGroupsAsAnagramStringGroupedArray = this.getGroupsAsArrayOfGroupedStrings();

      // start a new group and return currentGroupsAsAnagramStringGroupedArray
      this.groupedByLengthArray = [];
      this.groupedByLengthArray.push(wordMap);
      return currentGroupsAsAnagramStringGroupedArray;
    } catch (err) {
      throw new ServiceGeneralError(
        'AnagramGroup.checkAnagram failed',
        err,
      );
    }
  }

  /**
   * If there is an element on the groupedByLengthArray, then return
   * length of the word in the 1st element - we can cheat here
   * as all cleansed words will be the same length
   *
   * If groupedByLengthArray is empty, return 0
   *
   * @returns {int}
   */
  getGroupedByLengthArrayWordLength() {
    if (this.groupedByLengthArray.length > 0) {
      return this.groupedByLengthArray[0].clear.length;
    }
    return 0;
  }

  /**
   * With the current groupedByLengthArray state, find anagram
   * groups by adding each cleansed word to a map as key, and pushing
   * the corresponding plain words onto the keys' array.
   *
   * With the map, iterate through its keys and return an array of elements
   * where each element is the join of the clear word array associated with
   * the key
   *
   * Returns the empty array if no anagrams found. If an Anagram is found, returns
   * an array of strings, where each element represents a group of words that
   * anagrams (of each other)
   *
   *
   * @returns {Array}
   */
  getGroupsAsArrayOfGroupedStrings() {
    return this.mapToArrayOfStrings(
      this.groupedByCleansedWordMap(this.groupedByLengthArray),
      2,
    );
  }

  /**
   * Group the clear words with same cleansed word into an array
   * associated to a map key (the cleansed word).
   *
   * This allows us to a) identify the clear words to map to the same
   * cleansed words (anagrams) and b) to easily select anagram groups
   * with group size > 1
   *
   * @param groupedByLengthArray
   * @returns {map}
   */
  groupedByCleansedWordMap(groupedByLengthArray) {
    return groupedByLengthArray.reduce((accum, current) => {
      if (accum.has(current.cleansed)) {
        accum.get(current.cleansed).push(current.clear);
      } else {
        accum.set(current.cleansed, [current.clear]);
      }
      return accum;
    }, new Map());
  }

  /**
   * Construct an array where each element is
   * a string of clear words that correspond to the map key
   * if the map key value array.length >= groupSize
   *
   * @param map
   * @param groupSize
   * @returns {[]}
   */
  mapToArrayOfStrings(map, groupSize) {
    const hasGroupsArray = [];
    map.forEach((clearArray) => {
      if (clearArray.length >= groupSize) {
        hasGroupsArray.push(clearArray.join(', '));
      }
    });

    // If we have any groups then return them, otherwise it will
    // be the empty array
    return hasGroupsArray;
  }

  /**
   * Takes a string and returns a lowercase string with
   * chars ordered asc. Any anagram permutation will have the
   * same lowercase ordered string value.
   * @param word
   * @returns {string}
   */
  cleanseWord(word) {
    return word.toLowerCase()
      .replace(/[^a-z\d]/g, '')
      .split('')
      .sort()
      .join('');
  }
};
