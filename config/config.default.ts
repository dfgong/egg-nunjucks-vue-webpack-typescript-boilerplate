import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
const path = require('path');

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551083548700_4762';

  // add your egg config in here
  config.middleware = [];

  config.view = {
    cache: false,
    root: [
      path.join(appInfo.baseDir, 'app/view')
    ].join(','),
    mapping: {
      '.njk': 'nunjucks',
    },
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.njk',
  };

  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  }

  // add your special config in here
  const bizConfig = {
    aa: 'aa',
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
