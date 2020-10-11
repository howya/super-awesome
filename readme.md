# SuperAwesome Anagram Code Test

A program that takes as argument the path to a file containing one word per line, groups the words that are anagrams to each other, and writes to the standard output each of these groups.
The groups will be separated by newlines and the words inside each group by commas.

## Chosen Language
Node v12+

## Executing the Solution
* Decompress the provided project archive file
* Open terminal within root of project
* Install npm dependencies: `$npm install`
* Run with: `$node ./index.js ./input.txt`

## Executing Tests
* Open terminal within root of project
* Run tests: `$npm test`

## Data Structures Chosen / Rationale
### How to find if words are an anagram
There are two fundamental ways of testing two words to check if they are anagrams:
* Converting each word to a common value, then testing common value equality
* Converting each word to a map of letter key and letter counts, then comparing the maps together

Examples:
* Converting each word to a common value, then testing common value equality:
  * Case consistent sorting e.g. words Bca and Cab are anagrams and return the value 'abc' when converted to lowercase and sorted ascending. Within Node V8 engine this is implemented via Quick Sort, time complexity O(n log(n)) - for n elements in word - for sorting 11 or more elements. 10 or less elements is via Insertion Sort, time complexity of O(n^2).
  * Generating a word hash via a prime number character map e.g. with a prime number map of {a:2, b:3, c5}, Bca = 3 x 5 x 2 = 30, Cab = 5 x 2 x 3 = 30. This has time complexity of O(n) for n elements in word, but can quickly run into overflow errors for large words
* Converting each word to a map of letter key and letter counts, then comparing the maps together
  * The maps / counts for Bca and Cab are `{a: 1, b:1, c:1}`. When comparing just two words, these can be tested for equality in time complexity O(n) for n elements in word. When comparing more than 2 words, complexity is between O(n log(n)) and O(n^2), as sorting or nesting will be required for map equality tests.

### Chosen Implementation
In this test we can have many words of the same size to test for anagram groups, and that words can be any length, this implies that:
* we can't use a prime hash map for each word in case of overflow errors
* we could use maps of letter key and letter counts, but nesting / sorting would be required to test equality, and we'd need to implement this, introducing complexity and readability issues 

As such it was decided to use case consistent sorting of each word (e.g. word.toLowerCase().split().sort().join()), as this is readable and offers no complexity disadvantage to testing many letter key / count maps for equality.

The case consistent sort result (cleansed word), along with the 'clear' word are then constructed into an object and pushed onto a group array e.g. `[(clear: 'Cab', cleansed: 'abc'}]`.

Once we have our full set of words to test of a given size (identified by next word length), we can take each element of the array and group clear words by cleansed words via a map (complexity O(n)) e.g. `{ abc: ['Cab', 'Bca'], cde: ['Dec'] }`.

With this Map, it is then trivial (complexity O(n)) to output each key value (array) where length > 1, as a string of clear words that are anagrams.

## Big O analysis

## Enhancements
If given more time I would extend the following with:
* More in-depth testing of adapters (not seen as the fundamental goal of the task, so basic tests provided)
* 