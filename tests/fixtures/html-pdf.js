/**
 * @fileOverview Fixture for html pdf
 */
const R = require('ramda');
const sinon = require('sinon');

function HtmlPDF() {
  this.createStub = sinon.stub();
  this.toFileStub = sinon.stub();
  this.x = 'v';
  this.create = (htmlString) => {
    R.call(this.createStub, htmlString);
    this.htmlString = htmlString;
    return this;
  };

  this.toFile = (outputPath, cb) => {
    R.call(this.toFileStub, outputPath, cb);
    if (outputPath) {
      cb(null, '');
    } else {
      cb(new Error('The output path doesnt exists'), null);
    }
  };
}

module.exports = new HtmlPDF();
