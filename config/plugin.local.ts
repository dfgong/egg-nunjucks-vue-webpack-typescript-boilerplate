import { EggPlugin } from 'egg';
const path = require('path');

const plugin: EggPlugin = {
  // static: true,
  webpack: {
    enable: true,
    package: 'egg-webpack',
  },
  webpacknunjucks: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-webpack-nunjucks'),
  }
};

export default plugin;
