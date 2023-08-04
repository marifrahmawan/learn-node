const path = require('path');
const fs = require('fs');

exports.clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  return fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
