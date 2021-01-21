const express = require('express');
const pug = require('pug');
const AWS = require('aws-sdk');
const config = require('./config');

const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');
app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));

AWS.config.update(config.s3);
const s3 = new AWS.S3();

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// app.get('/', function (req, res) {
//
//   const params = {
//     Bucket: config.s3.bucket,
//     Delimiter: '/'
//   };
//
//   s3.listObjects(params, function (err, data) {
//     if (err) {
//       res.send(err);
//     } else {
//       const albums = [];
//       console.log(data);
//       for (let i in data.CommonPrefixes) {
//         const prefix = data.CommonPrefixes[i].Prefix;
//         const name = prefix.substr(0, prefix.length - 1).capitalize();
//         const album = {
//           'prefix': prefix,
//           'name': name
//         }
//         albums.push(album);
//       }
//       res.render('index', {
//         'albums': albums
//       });
//     }
//   });
// });

app.get('/', function (req, res) {

  const params = {
    Bucket: config.s3.bucket,
    Delimiter: '/'
  };

  s3.listObjects(params, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      const images = [];
      console.log(data)
      for (i in data.Contents) {
        const image = data.Contents[i];
        const imageProps = {
          url: 'https://' + config.s3.endpoint + '/' + config.s3.bucket + '/' + image.Key,
          full_suffix: config.suffix.full,
          rotation: (Math.random() * 20 - 10)
        };
        images.push(imageProps);
      }
      res.render('index', {
        'name': 'Gallery',
        'images': images
      });
    }
  });
});

const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
