const BDF = require('./BDF');
const ppm = require('ppm');
const fs = require('fs');
var toBlob = require('stream-to-blob')
var PNGImage = require('pngjs-image');
const gm = require('gm');
var Jimp = require("jimp");

// The result of running this function is that an image called scroll.ppm is generated
export default async function generateImage(text) {
  // font.loadSync('./fonts/knxt.bdf');
  const data = generateImageData([
    { text: 'RRSP $54.23', color: 0xFFFF33FF },
    { text: '▼ $2.24', color: 0xFF0000FF },
    { text: 'TFSA $182.39', color: 0xFFFF33FF },
    { text: '▲ $5.67', color: 0x00FF00FF },
  ]);

  generateImageFromData(data);
}

function generateImageData(strings) {
  // Set the color of each pixel properly
  const words = strings.map((word) => {
    const font = new BDF();
    font.loadSync('./fonts/7x14B.bdf');
    let textData = font.writeText(`${word.text} `);
    // console.log('test', textData.width, textData.height);

    for (let i = 0; i < textData.height; ++i) {
      for (let j = 0; j < textData.width; ++j) {
        if (textData[i][j] === 1) {
          textData[i][j] = word.color;
        }
      }
    }

    return textData;
  });

  // Go through and concatenate these things
  const result = [];
  for (let i = 0; i < words[0].height; ++i) {
    let row = [];
    for (let word of words) {
      row = row.concat(word[i]);
    }
    result.push(row);
  }

  console.log('result', result);

  return result;
}


function generateImageFromData(imageData) {
  var image = new Jimp(imageData[0].length, 16, function (err, image) {
      for (let i = 0; i < 16; ++i) {
        for (let j = 0; j < imageData[0].length; ++j) {
          if (imageData[i-1] && imageData[i-1][j]) {
            console.log('doing', imageData[i-1][j], j, i);
            image.setPixelColor(imageData[i-1][j], j, i);
          }
        }
      }

      image.write('jimp2.png', () => {
        // console.log('image written');
        gm('./jimp2.png')
          .write('./jimp2.ppm', function (err) {
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
