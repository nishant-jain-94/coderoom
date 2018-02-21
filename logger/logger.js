const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: 'short', levelInString: true });

module.exports = name => bunyan.createLogger({ name, stream: formatOut });
