/**
 * @fileOverview Helper to locate and load configuration files
 * @author Nishant Jain
 */
const R = require('ramda');
const YAML = require('yamljs');
const { existsSync, writeFileSync } = require('fs');
const { getPathToGlobalConfig, getPathToLocalConfig } = require('./file-name.fp.js');

/**
 * Loads the configuration at the given config path, if the file exists.
 * If the config file doesnt exists then it runs the errorHandler
 * @param {function} errorHandler
 * @param {function} configFile
 * @returns {Object | Error}
 */
const loadConfig = (errorHandler, configFile) =>
  (existsSync(configFile) ? YAML.load(configFile) : errorHandler());

/**
 * Curried Load Config Function
 * @param {function} errorHandler
 * @returns {fn(configFilePath)} returns a fn which accepts a config file path
 */
const curriedLoadConfig = R.curry(loadConfig);

/**
 * Throws file not found error
 * @returns { Error }
 */
const throwConfigFileNotFound = () => {
  const errorMessage = 'The configuration file .reviewrc cannot be found. Use \'coderoom initialize\' command to initialize coderoom in the folder';
  throw Error(errorMessage);
};

/**
 * Returns empty object
 * @returns  { Object }
 */
const returnEmptyObject = () => ({});

/**
 * Loads the config defaulting to an Error.
 * The error handler basically throws error if the config file is not found.
 * @param {string} configFilePath
 * @returns {Object | Error} Returns a config object or an error.
 */
const loadConfigDefaultingToError = curriedLoadConfig(throwConfigFileNotFound);

/**
 * Loads the config file defaulting to an empty object
 * The error handler basically returns an empty object, if the file is not found.
 * @param {string} configFilePath
 * @returns {Function(configFilePath)} Returns an function which returna an object
 * if the passed config file path is not found.
 */
const loadConfigDefaultingToEmptyObject = curriedLoadConfig(returnEmptyObject);

/**
 * Gets a config from the local config file path
 * @returns {Object | Error} returns a config object
 */
const getConfig = R.compose(loadConfigDefaultingToError, getPathToLocalConfig);

/**
 * Gets a global config from the global config file path
 * @returns {Object} returns an config Object
 */
const getGlobalConfig = R.compose(loadConfigDefaultingToEmptyObject, getPathToGlobalConfig);

/**
 * Curries Write File Sync
 * @param {string} fileName
 * @returns {function(data)} A function which accepts data to be written to the file.
 */
const curriedWriteFileSync = R.curry(writeFileSync);

/**
 * Writes to Local Config File
 * @param {string} data Takes in data to be written to the local config file.
 */
const writeToLocalConfig = R.call(R.compose(curriedWriteFileSync, getPathToLocalConfig));

/**
 * Writes to Local Config File
 * @param {string} data Takes in data to be written to the global config file.
 */
const writeToGlobalConfig = R.call(R.compose(curriedWriteFileSync, getPathToGlobalConfig));

/**
 * Takes an object and stringifies into YAML format with 2 spaces.
 * @param {Object} config
 * @returns {String} returns an yaml stringified string
 */
const yamlStringifyTo2Spaces = config => YAML.stringify(config, 2);

/**
 * Converts the local config object to the global config object
 * @param {Object} localConfig
 * @returns {Object} Global Config Object
 */
const transformToGlobalConfig = (config) => {
  const transformedConfig = {};
  transformedConfig[config.GITLAB_URL] = R.prop('API_TOKEN', config);
  transformedConfig.REVIEWERS_NAME = R.prop('REVIEWERS_NAME', config);
  return transformedConfig;
};

/**
 * Takes the new config object and assigns it to the old config object
 * @param {Object} config
 * @return {Object} returns an updated config object
 */
const updateGlobalConfig = config => Object.assign({}, getGlobalConfig(), config);

/**
 * Sets the local config in the local config file path
 * @param {Object} config inputs a config object to be written to the local config file path
 */
const setConfig = R.compose(writeToLocalConfig, yamlStringifyTo2Spaces);

/**
 * Sets the Global Config in the Global Config File Path
 * @param {Object} config Inputs a config object to be written to the global config file path
 */
const setGlobalConfig = R.compose(
  writeToGlobalConfig,
  yamlStringifyTo2Spaces,
  updateGlobalConfig,
  transformToGlobalConfig,
);

module.exports = {
  getConfig,
  setConfig,
  getGlobalConfig,
  setGlobalConfig,
  __private__: {
    transformToGlobalConfig,
    yamlStringifyTo2Spaces,
    writeToGlobalConfig,
    writeToLocalConfig,
    curriedWriteFileSync,
    loadConfigDefaultingToEmptyObject,
    loadConfigDefaultingToError,
    returnEmptyObject,
    throwConfigFileNotFound,
    curriedLoadConfig,
    loadConfig,
  },
};
