const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');
const cdn = process.env === 'product'? 'https://cdnxxx.com': '';
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 入口处理
const entry = 'app/web/page/**/*.ts';
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
const htmlWithImgLoader = 'html-withimg-loader!';
let HtmlWebpackPlugins = [];

// 合成page html生成的配置信息
Object.keys(entries).forEach(entryName => {
  const template = entries[entryName].replace('.ts', '.html');
  const filename = '../' + template.replace('/web/', '/view/');
  const minify = false;
  const hash = false;
  const inject = entryName.startsWith('layout')? false: true;
  const chunks = [entryName, 'runtime', 'common'];
  HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
    template:  htmlWithImgLoader+template, 
    filename, 
    minify, 
    hash, 
    inject, 
    chunks
  }));

  // 合成fragment生成的html的配置信息
  if(entryName.startsWith('page')) {
    let pathArr = `app/web/${entryName}`.split('/');
    pathArr.splice(3,1);
    const fragmentGlobStr = pathArr.join('/') + '/fragment/**/*.html';
    const fragments = getGlobEntry(fragmentGlobStr);
    Object.keys(fragments).forEach(fragmentName => {
      const template = fragments[fragmentName];
      const filename = '../' + template.replace('/web/', '/view/');
      const minify = false;
      const hash = false;
      const inject = false;
      HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template: htmlWithImgLoader+template, 
        filename, 
        minify, 
        hash, 
        inject
      }));
    });
  }
});

// 合成layout生成html
const layoutGlobStr = 'app/web/layout/**/*.html';
const layoutFragments = getGlobEntry(layoutGlobStr);
Object.keys(layoutFragments).forEach(fragmentName => {
  const template = layoutFragments[fragmentName];
  const filename = '../' + template.replace('/web/', '/view/');
  const minify = false;
  const hash = false;
  const inject = false;
  HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
    template: htmlWithImgLoader+template, 
    filename, 
    minify, 
    hash, 
    inject
  }));
});

module.exports = {
    framework: 'html',
    entry: entries,
    buildPath: path.resolve(__dirname, 'public'), // 静态资源生成的路径
    buildDir: path.resolve(__dirname, 'app/view'), // html生成的路径
    publicPath: 'public',
    cdn,
    devtool: 'source-map',
    tye: 'client',
    target: 'web',
    resolve: {
      extensions: ['.ts']
    },
    alias: {
      common: 'app/web/common',
    },

    module: {
        rules: [
          {
            test: /\.html$/,
            use: [
              { loader: 'html-loader' }
            ]
          },
          {
            test: /\.js$/,
             exclude: /node_modules/,
             loader: "babel-loader",
             options: {
               presets: ['@babel/preset-env']
             }
          },
          {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              },
              {
                loader: 'ts-loader'
              }
            ]
          },
          {
            test: /\.vue$/,
            loader: "vue-loader"
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
          copy: [{
            from: 'app/web/static',
            to: 'static'
          }]
        },
        {
            env: 'prod',
            name: new CleanWebpackPlugin(['app/view'])
        },
        {
          provide: {
            args: {
              $: 'jquery',
              jQuery: 'jquery'
            }
          }
        },
        {
          // env: 'dev',
          name: new VueLoaderPlugin()
        }
    ],
    customize(webpackConfig) {
      webpackConfig.plugins.push(...HtmlWebpackPlugins);
    }
}