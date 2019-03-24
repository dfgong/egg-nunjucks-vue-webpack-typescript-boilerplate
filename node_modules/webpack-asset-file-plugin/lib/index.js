'use strict';
const fs = require('fs');

class AssetFileWebpackPlugin {
  constructor(opts) {
    this.opts = opts;
  }

  apply(compiler) {
    // fix apply more times
    compiler.hooks.emit.tap('AssetFileWebpackPlugin', compilation => {
      this.opts.assets.forEach(chunk => {
        const filepath = chunk.filepath;
        const outputName = chunk.outputName;
        const content = fs.readFileSync(filepath, 'utf8');
        compilation.assets[outputName] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          }
        };
      });
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('AssetFileHtmlWebpackPlugin', htmlPlugin => {
          const paths = this.opts.assets.reduce((result, chunk) => {
            result.push(chunk.outputPath);
            return result;
          }, []);
          // fix manifest repeat chunk
          htmlPlugin.assets.js = Array.from(new Set(paths)).concat(htmlPlugin.assets.js);
        });
      }
    });
  }
}

module.exports = AssetFileWebpackPlugin;