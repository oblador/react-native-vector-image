const { PassThrough } = require('stream');
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');

function convertSvgToPdf(svgSource, size) {
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
  const stream = new PassThrough();

  SVGtoPDF(doc, svgSource, 0, 0, {
    assumePt: 1,
  });
  doc.pipe(stream);
  doc.end();

  return stream;
}

module.exports = convertSvgToPdf;
