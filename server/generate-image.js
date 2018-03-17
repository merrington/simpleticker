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
  font.loadSync('./fonts/7x14.bdf');
  let textData = font.writeText(text);

  // console.log('textData', textData);

  // var image = PNGImage.createImage(textData.width, 16);
  //
  // // Set a pixel at (20, 30) with red, having an alpha value of 100 (half-transparent)
  // for (let i = 0; i < 16; ++i) {
  //   for (let j = 0; j < textData.width; ++j) {
  //     image.setAt(j, i, {
  //       red: (textData[i] && textData[i][j] === 1 ? 255 : 0),
  //       green: (textData[i] && textData[i][j] === 1 ? 255 : 0),
  //       blue: (textData[i] && textData[i][j] === 1 ? 255 : 0),
  //       alpha: 100,
  //     });
  //   }
  // }
  //
  // image.writeImage('scroll.png', function (err) {
  //     if (err) throw err;
  //     console.log('Written to the file');
  // });

  var image = new Jimp(textData.width, 16, function (err, image) {
      // this image is 256 x 256, every pixel is set to 0x00000000

      for (let i = 0; i < 16; ++i) {
        for (let j = 0; j < textData.width; ++j) {
          if (textData[i] && textData[i][j]) {
            image.setPixelColor(0xFFFFFFFF, j, i);
          }
          // image.setAt(j, i, {
          //   red: (textData[i] && textData[i][j] === 1 ? 255 : 0),
          //   green: (textData[i] && textData[i][j] === 1 ? 255 : 0),
          //   blue: (textData[i] && textData[i][j] === 1 ? 255 : 0),
          //   alpha: 100,
          // });
        }
      }

      image.write('jimp.png', () => {
        console.log('image written');
        gm('./jimp.png')
          .write('./jimp.ppm', function (err) {
            if (!err) console.log('done');
            if (err) console.log('error!', err);
          });
      }); // Node-style callback will be fired when write is successful
  });


  // resize and remove EXIF profile data
  // const imageData = [];

  // for (let i = 0; i < textData.height; ++i) {
  //   imageData.push(textData[i].map((status) => {
  //     if (status === 1) {
  //       return [255, 255, 255];
  //     } else {
  //       return [255, 0, 0];
  //     }
  //   }));
  // }
  //
  // // Pad the height of the image
  // for (let i = 0; i < 16 - textData.height; ++i) {
  //   const row = [];
  //   for (let j = 0; j < textData[0].length; ++j) {
  //     row.push([255, 0, 0]);
  //   }
  //   imageData.push(row);
  // }

  // console.log('imageData', imageData);

  // await makePPM(imageData);
}

function makePPM(data) {
  return new Promise((resolve, reject) => {
    var wstream = fs.createWriteStream('scroll2.ppm');
    const dataStream = ppm.serialize(data);
    dataStream.pipe(wstream);
  });
}
