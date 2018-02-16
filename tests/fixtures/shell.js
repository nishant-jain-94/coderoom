/**
 * @fileOverview Fixture to list
 * directories in shelljs npm package
 */
const R = require('ramda');
const cadets = require('./cadets.json');

const ls = () => R.map(R.prop('username'), cadets);

module.exports = {
  ls,
};
