/**
 * @fileOverview Fixture for ProgressBar
 */
const sinon = require('sinon');

class Bar {
  constructor() {
    this.startStub = sinon.stub().returns(Promise.resolve('started'));
    this.incrementStub = sinon.stub().returns(Promise.resolve('incremented'));
    this.start = this.startStub;
    this.increment = this.incrementStub;
  }
}

// Wraps Bar under the progress namespace
const Progress = {
  Bar,
};

module.exports = Progress;
