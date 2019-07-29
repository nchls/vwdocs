const devConfig = require('./webpack.config.js');

const prodConfig = devConfig;

prodConfig.mode = 'production';

module.exports = prodConfig;
