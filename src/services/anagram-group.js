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
   * @returns {boolean|Array}
   */
  checkAnagram(word) {
    try {
      // TODO validate word is string with no spaces

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
        return false;
      }

      // If the cleansed word is the same length as the cleansed
      // words in the current group then push to the group
      if (this.checkWordMapLengthMatchToGroup(wordMap.cleansed)) {
        this.groupedByLengthArray.push(wordMap);
        return false;
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
   *
   * @returns {boolean|[]}
   */
  getGroupsAsArrayOfGroupedStrings() {
    // Create map of each cleansed word, pushing on the
    // clear words associated
    const groupedByCleansedWordMap = this.groupedByLengthArray.reduce((accum, current) => {
      if (accum.has(current.cleansed)) {
        accum.get(current.cleansed).push(current.word);
      } else {
        accum.set(current.cleansed, [current.word]);
      }
      return accum;
    }, new Map());

    // Use the map to construct an array where each element is
    // a string of clear words that correspond to the map key
    // if the map key value array has more than one clear word
    const hasGroupsArray = [];
    groupedByCleansedWordMap.forEach((clearArray) => {
      if (clearArray.length > 1) {
        hasGroupsArray.push(this.concatArrayOfStrings(clearArray));
      }
    });

    // If we have any groups then return them, otherwise false
    return hasGroupsArray.length < 1 || hasGroupsArray;
  }

  /**
   * Returns array elements concatenated by ', '
   * @returns {string}
   */
  concatArrayOfStrings(stringsArray) {
    return stringsArray.join(', ');
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
