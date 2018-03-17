const BDF = require('./BDF');
const ppm = require('ppm');
const fs = require('fs');
var toBlob = require('stream-to-blob')

// The result of running this function is that an image called scroll.ppm is generated
export default async function generateImage(text) {
  const font = new BDF();
  font.loadSync('./fonts/7x14.bdf');
  let textData = font.writeText(text);

  // console.log('textData', textData);

  const imageData = [];

  for (let i = 0; i < textData.height; ++i) {
    imageData.push(textData[i].map((status) => {
      if (status === 1) {
        return [255, 255, 255];
      } else {
        return [0, 0, 0];
      }
    }));
  }

  // console.log('imageData', imageData);

  await makePPM(imageData);
}

function makePPM(data) {
  return new Promise((resolve, reject) => {
    var wstream = fs.createWriteStream('scroll.ppm');
    const dataStream = ppm.serialize(data);
    dataStream.pipe(wstream);
  });
}
