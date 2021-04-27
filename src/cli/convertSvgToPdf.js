const fs = require('fs');
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');

function convertSvgToPdf(sourcePath, targetPath, size) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size,
      margin: 0,
      info: {
        // To make builds deterministic we need to set a static
        // creation date (and file descriptors are not content
        // reliable in this regard)
        // https://www.nasa.gov/mission_pages/apollo/apollo11.html
        CreationDate: new Date('July 20, 69 00:20:18 GMT+00:00'),
      },
    });
    const stream = fs.createWriteStream(targetPath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    const svg = fs.readFileSync(sourcePath).toString();

    SVGtoPDF(doc, svg, 0, 0, {
      assumePt: 1,
    });

    doc.pipe(stream);
    doc.end();
  });
}

module.exports = convertSvgToPdf;
