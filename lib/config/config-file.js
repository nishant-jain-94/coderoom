/**
 * @fileOverview Helper to locate and load configuration files
 * @author Nishant Jain
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const { GLOBAL_CONFIG_FILE_NAME, CONFIG_FILE_NAME } = require('./file-name.js');


const load = () => {
  const cwd = process.cwd();
  if (!fs.existsSync(path.join(cwd, CONFIG_FILE_NAME))) {
    throw Error('The configuration file .reviewrc cannot be found. Use \'coderoom initialize\' command to initialize coderoom in the folder');
  }
  const config = YAML.load(path.join(cwd, CONFIG_FILE_NAME));
  return config;
};

const loadGlobalConfig = () => {
  const globalConfigFilePath = path.join(__dirname, GLOBAL_CONFIG_FILE_NAME);
  const globalConfig = {};
  if (!fs.existsSync(globalConfigFilePath)) {
    fs.writeFileSync(globalConfigFilePath, '', 'utf8');
  }
  Object.assign(globalConfig, YAML.load(globalConfigFilePath));
  return globalConfig;
};

module.exports = {
  load,
  loadGlobalConfig,
};
