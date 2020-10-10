const { ServiceGeneralError } = require('./errors/general-error');
const { ServiceValidationError } = require('./errors/validation-error');

/* eslint class-methods-use-this: [
  "error", { "exceptMethods": ["concatArrayOfStrings", "cleanseWord"] }
] */
module.exports.AnagramGroup = class {
  /**
   * Instantiate the empty groupedByLengthArray
   */
  constructor() {
    this.groupedByLengthArray = [];
  }

  /**
   *
   * @param word
   * @returns {Array}
   */
  checkAnagram(word) {
    try {
      // Ensure word is a string without white space
      if(typeof word !== 'string' || /\s/.test(word)) {
        throw new ServiceValidationError(
          'input not a string, or contains whitespace, typeof: ${typeof word}'
        );
      }

      // For a word, cleanse it and construct an object that
      // maps the cleansed word to the 'clear' word
      const wordMap = {
        cleansed: this.cleanseWord(word),
        word,
      };

      // If the groupArray is empty then we have
      // nothing to compare. Push onto the array and
      // return false to indicate there is not a complete group yet
      if (this.groupedByLengthArray.length < 1) {
        this.groupedByLengthArray.push(wordMap);
        return [];
      }

      // If the cleansed word is the same length as the cleansed
      // words in the current group then push to the group
      if (this.checkWordMapLengthMatchToGroup(wordMap.cleansed)) {
        this.groupedByLengthArray.push(wordMap);
        return [];
      }

      // Otherwise, if not the same length then we are starting a new
      // group (as per assumption / examples that input is ordered length asc).
      // so get the existing group plain words as an array string
      const currentGroupsAsAnagramStringGroupedArray = this.getGroupsAsArrayOfGroupedStrings();

      // start a new group (unless the new word length is <
      // previous length, then error)
      if (this.checkLengthMoreThanGroupCleansedLength(
        wordMap.cleansed.length,
      )) {
        this.groupedByLengthArray = [];
        this.groupedByLengthArray.push(wordMap);
        return currentGroupsAsAnagramStringGroupedArray;
      }

      throw new ServiceValidationError('input not ordered length ascending');
    } catch (err) {
      throw new ServiceGeneralError(
        'AnagramGroup.checkAnagram failed',
        err,
      );
    }
  }

  /**
   * Check that length is greater than the length of
   * cleansed words in the current group - we can cheat here
   * as all cleansed words will be the same length
   * @param length
   * @returns {boolean}
   */
  checkLengthMoreThanGroupCleansedLength(length) {
    if (this.groupedByLengthArray.length > 0) {
      return length > this.groupedByLengthArray[0].cleansed.length;
    }
    return true;
  }

  /**
   *
   * @param cleansed
   * @returns {boolean}
   */
  checkWordMapLengthMatchToGroup(cleansed) {
    if (this.groupedByLengthArray.length > 0) {
      return this.groupedByLengthArray[0].cleansed.length === cleansed.length;
    }
    return false;
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
   * @returns {Array}
   */
  getGroupsAsArrayOfGroupedStrings() {
    return this.mapToArrayOfStrings(
      this.groupedByCleansedWordMap(this.groupedByLengthArray),
      1,
    );
  }

  /**
   *
   * @param groupedByLengthArray
   * @returns {map}
   */
  groupedByCleansedWordMap(groupedByLengthArray) {
    return groupedByLengthArray.reduce((accum, current) => {
      if (accum.has(current.cleansed)) {
        accum.get(current.cleansed).push(current.word);
      } else {
        accum.set(current.cleansed, [current.word]);
      }
      return accum;
    }, new Map());
  }

  /**
   * Construct an array where each element is
   * a string of clear words that correspond to the map key
   * if the map key value array.length > length
   *
   * @param map
   * @param length
   * @returns {[]}
   */
  mapToArrayOfStrings(map, length) {
    const hasGroupsArray = [];
    map.forEach((clearArray) => {
      if (clearArray.length > length) {
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
