const fs = require('fs-extra');
const path = require('path');

const readFixture = (file) =>
  fs.readFileSync(path.join(__dirname, file), 'utf8').toString();

module.exports = {
  dropShadow: readFixture('drop-shadow.svg'),
  reactLogo: readFixture('react-logo.svg'),
  rectangle: readFixture('rectangle.svg'),
};
