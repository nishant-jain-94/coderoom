/**
 * @fileOverview Creates a fake Gitlab class
 * with the intent to fake groups.all
 * method of the original gitlab package.
 * This groups.all methods returns no groups.
 */
const sinon = require('sinon');

class Gitlab {
  constructor(credentials) {
    this.credentials = credentials;
    this.allGroupsStub = sinon.stub().yields(null);
    this.groups = {
      all: this.allGroupsStub,
    };
  }
}

module.exports = Gitlab;
