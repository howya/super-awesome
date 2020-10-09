const fs = require('fs');
const { AnagramController } = require('./src/controllers/anagram-controller');


(( async () => {
  try {
    const filePath = process.argv[2];
    const fileStream = await fs.createReadStream(filePath);
    fileStream.on('error', function(err) {
      // Note, here I would handle the error / bubble / log it etc
      // In this test we don't have a means of logging it, so pushing to
      // console for convenience
      console.log(`There is an issue with your file ${filePath}`, err);
    });
    await AnagramController.processAnagramStream(fileStream)
  } catch(err) {
    // Note, here I would handle the error / bubble / log it etc
    // In this test we don't have a means of logging it, so pushing to
    // console for convenience
    console.log(err);
  }
})());


