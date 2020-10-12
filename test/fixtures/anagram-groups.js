// Anagrams = abc, cba, bac
module.exports = {
  groupOfThree: {
    input: [
      'abc',
      'Def',
      'Cba',
      'bac',
      'rtz',
    ],
    output: ['abc', 'Cba', 'bac'],
  },
  groupOfFour: {
    input: [
      'abcd',
      'Defg',
      'Cbad',
      'baDc',
      'qwer',
      'qwez',
      'bdaC'
    ],
    output: ['abcd', 'Cbad', 'baDc', 'bdaC'],
  },
}