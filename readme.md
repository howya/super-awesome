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

# Assumptions
* Input file is ordered by length ascending
* Each word contains only characters a-zA-Z (no hyphens / whitespace etc)

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

Once we have our full set of words to test of a given size (identified by next word length being longer than words in current group array), we can take each element of the array and group clear words by cleansed words via a map (complexity O(n)) e.g. `{ abc: ['Cab', 'Bca'], cde: ['Dec'] }`.

With this Map, it is then trivial (complexity O(n)) to output each key value (array) where length > 1, as a string of clear words that are anagrams.

## Big O analysis
Big O analysis restricted to AnagramGroup class, as controller and stream adapters are linear, i.e. O(n), where n is number of words in stream.

For each word submitted to AnagramGroup.checkAnagram(word) of word length n:
* cleanseWord() - for words of length > 10, O(n log(n)), for words of length < 11, O(n^2)
* groupedByCleansedWordMap() - array.reduce, complexity O(n) where n is the average number of words of same size
* mapToArrayOfStrings() - map.forEach, complexity O(nm) where n is the average number of common cleansed words in group, and m is the average number of clear words per cleansed word

As groupedByCleansedWordMap() and mapToArrayOfStrings() are only called when the word size on the input stream changes, I would define Big O as:
* for words of length > 10, O(n log(n)), for words of length < 11, O(n^2)
 

## Enhancements
If given more time I would extend the solution as follows:
* More in-depth testing of adapters (not seen as the fundamental goal of the task, so a basic test provided)
* The ability to handle hyphens. This was not included as it was not required in the specification and not present in the example data sets
* Type checking of adapter method input parameters
* Coming from a PHP background, I'd prefer to implement in TypeScript, but I'm not familiar enough with TypeScript yet. This would allow dependency injection typed on interface / contract for adapters (Dependency Inversion), and easier validation / control of method paramter and return types.
* If optimal performance were required I'd:
  * Implement quicksort for words of length <= 10 characters, rather than rely on Node V8 Insertion Sort
  * Potentially consider using Node worker threads to hand off sorting of each new word. This would then concurrently process n words for n cores. Any performance increase would be dependent on ensuring a shared pool of workers was available and maintained for the duration of the main process, ensuring low inter-process communication and leveraging shared memory data structures etc.
    