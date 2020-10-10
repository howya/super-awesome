const fs = require('fs');
const { AnagramController } = require('./src/controllers/anagram-controller');

// Note, here I would handle the error / bubble / log it etc
// In this test we don't have a means of logging it, so pushing to
// console for convenience
(( async () => {
  try {
    const filePath = process.argv[2];
    if (filePath === undefined) {
      console.log('You must specify file path as argument e.g. $node ./index.js input.txt');
      return;
    }
    const fileStream = await fs.createReadStream(filePath);
    fileStream.on('error', function(err) {
      console.log(`There is an issue with your file ${filePath}`, err);
    });
    await AnagramController.processAnagramStream(fileStream, process.stdout)
  } catch(err) {
    console.log(err);
  }
})());


