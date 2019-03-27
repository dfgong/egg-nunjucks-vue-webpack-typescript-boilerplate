const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');

const entry = 'app/web/@(page|layout)/**/*.ts';
const root = 'app/web/';

const globEntry = (entry) => {
  const result = entry.match(/!\((.*)\)/);
  if (result && result.length) {
    const matchIgnore = result[0];
    const matchIgnoreKeys = result[1];
    const matchStr = entry.replace(matchIgnore, '');
    const ignore = matchIgnoreKeys.split('|').map(key => {
      if (/\./.test(key)) {
        return `**/${key}`;
      }
      return `**/${key}/**`;
    });
    return glob.sync(matchStr, { root, ignore });
  }
  return glob.sync(entry, { root });
};

const getGlobEntry = (entry) => {
  const files = globEntry(entry);
  const entries = {};
  files.forEach(file => {
    const ext = path.extname(file);
    const entryName = path.posix.relative(root, file).replace(ext, '');
    entries[entryName] = file;
  });
  return entries;
};
/**
 *  生成的入口格式
 *  entry: { 
      'layout/foot/foot': 'app/web/layout/foot/foot.ts',
      'page/aa/aa': 'app/web/page/aa/aa.ts',
      'page/home/home': 'app/web/page/home/home.ts' 
    },
 */
const entries = getGlobEntry(entry);

let HtmlWebpackPlugins = [];
// 入口文件生成html
Object.keys(entries).forEach(entryName => {
  const template = entries[entryName].replace('.ts', '.njk');
  const filename = '../' + template.replace('/web/', '/view/');
  const minify = false;
  const hash = false;
  const inject = entryName.startsWith('layout')? false: true;
  const chunks = [entryName, 'runtime'];
  HtmlWebpackPlugins.push(new HtmlWebpackPlugin({template:  'html-withimg-loader!'+template, filename, minify, hash, inject, chunks}));

  // fragment
  if(entryName.startsWith('page')) {
    let pathArr = `app/web/${entryName}`.split('/');
    pathArr.splice(3,1);
    const fragmentGlobStr = pathArr.join('/') + '/fragment/**/*.njk';
    const fragments = getGlobEntry(fragmentGlobStr);
    Object.keys(fragments).forEach(fragmentName => {
      const template = fragments[fragmentName];
      const filename = '../' + template.replace('/web/', '/view/');
      const minify = false;
      const hash = false;
      const inject = false;
      // const chunks = [fragmentName, 'runtime'];
      HtmlWebpackPlugins.push(new HtmlWebpackPlugin({template:  'html-withimg-loader!'+template, filename, minify, hash, inject, chunks}));
    });
  }
});

module.exports = {
    framework: 'html',
    entry: entries,
    buildPath: 'public',
    buildDir: '../app/view',
    module: {
        rules: [
          {
            test: /\.njk$/,
            use: [
              { loader: 'html-loader' }
            ]
          },
          {
            test: /\.js$/,
             exclude: /node_modules/,
             loader: "babel-loader"
            },
          {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader'
              },
              {
                loader: 'ts-loader'
              }
            ]
          },
        ]
      },
    loaders: {
        scss: true
    },
    plugins: [
        {
            html: false
        },
        {
            env: 'prod',
            name: new CleanWebpackPlugin('app/view')
        }
    ],
    cdn: 'https://a.com',
    customize(webpackConfig) {
      webpackConfig.plugins.push(...HtmlWebpackPlugins);
    }
}