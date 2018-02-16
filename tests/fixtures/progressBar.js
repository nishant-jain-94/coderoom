/**
 * @fileOverview Fixture for ProgressBar
 */
const sinon = require('sinon');

class Bar {
  constructor() {
    this.startStub = sinon.stub();
    this.incrementStub = sinon.stub();
    this.start = this.startStub;
    this.increment = this.incrementStub;
  }
}

// Wraps Bar under the progress namespace
const Progress = {
  Bar,
};

module.exports = Progress;
