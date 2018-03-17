const BDF = require('./BDF');
const ppm = require('ppm');
const fs = require('fs');
var toBlob = require('stream-to-blob')
var PNGImage = require('pngjs-image');
const gm = require('gm');
var Jimp = require("jimp");

// The result of running this function is that an image called scroll.ppm is generated
export default async function generateImage(text) {
  const font = new BDF();
  // font.loadSync('./fonts/knxt.bdf');
  font.loadSync('./fonts/7x14.bdf');
  console.log('tostring', font.toString());
  let textData = font.writeText(`${text} `);

  var image = new Jimp(textData.width, 16, function (err, image) {
      for (let i = 0; i < 16; ++i) {
        for (let j = 0; j < textData.width; ++j) {
          if (textData[i-1] && textData[i-1][j]) {
            image.setPixelColor(0xFFFFFFFF, j, i);
          }
        }
      }

      image.write('jimp.png', () => {
        console.log('image written');
        gm('./jimp.png')
          .write('./jimp.ppm', function (err) {
            if (!err) console.log('done');
            if (err) console.log('error!', err);
          });
        });
  });
}

function makePPM(data) {
  return new Promise((resolve, reject) => {
    var wstream = fs.createWriteStream('scroll2.ppm');
    const dataStream = ppm.serialize(data);
    dataStream.pipe(wstream);
  });
}
