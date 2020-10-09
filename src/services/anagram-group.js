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

  checkAnagram(word) {
    try {
      // TODO validate word is string with no spaces
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
   * as
   * @param length
   * @returns {boolean}
   */
  checkLengthMoreThanGroupCleansedLength(length) {
    if (this.groupedByLengthArray.length > 0) {
      return length > this.groupedByLengthArray[0].cleansed.length;
    }
    return true;
  }

  checkWordMapLengthMatchToGroup(cleansed) {
    if (this.groupedByLengthArray.length > 0) {
      return this.groupedByLengthArray[0].cleansed.length === cleansed.length;
    }
    return false;
  }

  /**
   *
   * words
   * @returns {array}
   */
  getGroupsAsArrayOfGroupedStrings() {
    // Create map of each cleansed word, pushing on the
    // clear words associated
    const groupedByCleansedWordObj = this.groupedByLengthArray.reduce((accum, current) => {
      if (accum.has(current.cleansed)) {
        accum.get(current.cleansed).push(current.word);
      } else {
        accum.set(current.cleansed, [current.word]);
      }
      return accum;
    }, new Map());

    const hasGroupsArray = [];
    groupedByCleansedWordObj.forEach((clearArray) => {
      if (clearArray.length > 1) {
        hasGroupsArray.push(this.concatArrayOfStrings(clearArray));
      }
    });

    return hasGroupsArray;
  }

  /**
   * Returns array elements concatenated by ', '
   * @returns {string}
   */
  concatArrayOfStrings(stringsArray) {
    return stringsArray.join(', ');
  }

  /**
   *
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
