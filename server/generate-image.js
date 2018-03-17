const BDF = require('./BDF');
const ppm = require('ppm');
const fs = require('fs');
const gm = require('gm');
var Jimp = require('jimp');

export default async function generateImage(text) {
  const data = generateImageData([
    { text: 'RRSP $54.23', color: 0xFFFF33FF, font: '7x14B' },
    { text: '▼', color: 0xFF0000FF, font: '7x14' },
    { text: '$2.24', color: 0xFF0000FF, font: '7x14' },
    { text: 'TFSA $182.39', color: 0xFFFF33FF, font: '7x14B' },
    { text: '▲', color: 0x00FF00FF, font: '7x14' },
    { text: '$5.67', color: 0x00FF00FF, font: '7x14' },
  ]);

  return generateImageFromData(data);
}

function generateImageData(strings) {
  const words = strings.map((word) => {
    const font = new BDF();
    font.loadSync(`./fonts/${word.font}.bdf`);
    let textData = font.writeText(`${word.text} `);

    for (let i = 0; i < textData.height; ++i) {
      for (let j = 0; j < textData.width; ++j) {
        if (textData[i][j] === 1) {
          textData[i][j] = word.color;
        }
      }
    }

    return textData;
  });

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
  return new Promise((resolve, reject) => {
    var image = new Jimp(imageData[0].length, 16, function (err, image) {
        for (let i = 0; i < 16; ++i) {
          for (let j = 0; j < imageData[0].length; ++j) {
            if (imageData[i-1] && imageData[i-1][j]) {
              console.log('doing', imageData[i-1][j], j, i);
              image.setPixelColor(imageData[i-1][j], j, i);
            }
          }
        }

        image.write('scroll.png', () => {
          gm('./scroll.png')
            .write('./scroll.ppm', function (err) {
              if (!err) resolve('./scroll.ppm');
              if (err) console.log('error!', err);
            });
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
