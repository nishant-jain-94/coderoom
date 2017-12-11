/**
 * @fileOverview Helper to locate and load configuration files
 * @author Nishant Jain
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const configFileName = require('./file-name.js');


const load = () => {
  const cwd = process.cwd();
  if (!fs.existsSync(path.join(cwd, configFileName))) {
    throw Error('The configuration file .reviewrc cannot be found.');
  }
  const config = YAML.load(path.join(cwd, configFileName));
  return config;
};

module.exports = {
  load,
};
