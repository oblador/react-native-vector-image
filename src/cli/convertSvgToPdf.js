const fs = require('fs');
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');

function convertSvgToPdf(sourcePath, targetPath, size) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size, margin: 0 });
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
