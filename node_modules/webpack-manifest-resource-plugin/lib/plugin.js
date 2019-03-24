var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var _ = require('lodash');
// var mutexify = require('mutexify');

// var lock = mutexify();

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    absPath: '',
    fileName: 'manifest.json',
    commonsChunk: [],
    transformExtensions: /^(gz|map)$/i,
    asset: true,
    writeToFileEmit: false,
    seed: null,
    filter: null,
    map: null,
    generate: null,
    sort: null
  }, opts || {});
  this.isRunned = false;
}

ManifestPlugin.prototype.getFileType = function(str) {
  str = str.replace(/\?.*/, '');
  var split = str.split('.');
  var ext = split.pop();
  if (this.opts.transformExtensions.test(ext)) {
    ext = split.pop() + '.' + ext;
  }
  return ext;
};

// old version not include publicPath
ManifestPlugin.prototype.normalizeFile = function(manifest, prefix, proxy) {
  if (proxy) {
    var normalizeManifest = {};
    Object.keys(manifest).forEach(key => {
      normalizeManifest[key] = manifest[key].replace(prefix, '');
    });
    return normalizeManifest;
  }
  return manifest;
};

ManifestPlugin.prototype.normalize = function(manifest) {
  var normalizeManifest = {};
  Object.keys(manifest).forEach(key => {
    const normalizeKey = key.replace(/^\\/g, '').replace(/\\/g, '/');
    const normalizeValue = manifest[key].replace(/\\/g, '/');
    if (this.opts.proxy) {
      normalizeManifest[normalizeKey] = normalizeValue.replace(this.opts.host, '');
    } else {
      normalizeManifest[normalizeKey] = normalizeValue;
    }
  });
  return normalizeManifest;
};

ManifestPlugin.prototype.isMatch = (regexArray, strMatch, defaultMatch = false) => {
  if (!regexArray || (Array.isArray(regexArray) && regexArray.length === 0)) {
    return defaultMatch;
  }
  regexArray = Array.isArray(regexArray) ? regexArray : [regexArray];
  return regexArray.some(item => new RegExp(item, '').test(strMatch));
};

ManifestPlugin.prototype.getDeps = function(webpackConfig, manifest, commonsChunk) {
  const deps = {};
  const commonChunkScript = [];
  const commonChunkCss = [];
  commonsChunk.forEach(item => {
    if (typeof item === 'string') {
      const jsKey = `${item}.js`;
      const cssKey = `${item}.css`;
      manifest[jsKey] && commonChunkScript.push(manifest[jsKey]);
      manifest[cssKey] && commonChunkCss.push(manifest[cssKey]);
    }
  });
  const entryNames = Object.keys(webpackConfig.entry);
  entryNames.forEach(entryName => {
    const dllScript = [];
    const dllCss = [];
    const pageName = entryName.replace(/\.js$/, '');
    const isCommonsChunk = commonsChunk.find(chunk => {
      return chunk === pageName || typeof chunk === 'object' && chunk.name === pageName;
    });
    commonsChunk.forEach(dll => {
      if (typeof dll === 'object') {
        if (!isCommonsChunk && this.isMatch(dll.include, pageName, true) && !this.isMatch(dll.exclude, pageName, false)) {
          const jsKey = `${dll.name}.js`;
          const cssKey = `${dll.name}.css`;
          manifest[jsKey] && dllScript.push(manifest[jsKey]);
          manifest[cssKey] && dllCss.push(manifest[cssKey]);
        }
      }
    });
    if(!isCommonsChunk) {
      const js = dllScript.concat(commonChunkScript).concat(manifest[`${pageName}.js`] || []);
      const css = dllCss.concat(commonChunkCss).concat(manifest[`${pageName}.css`] || []);
      deps[`${pageName}.js`] = { js, css };
    }
  });
  return deps;
};

ManifestPlugin.prototype.getResource = function(webpackConfig, manifest, publicPath) {
  const buildPath = this.opts.buildPath.replace(this.opts.baseDir, '').replace(/^\//, '');
  const normalizeManifest = this.normalize(manifest);
  const manifestDll = this.opts.manifestDll;
  const dllConfig = this.opts.dllConfig;
  const dllDir = this.opts.dllDir;
  const dllChunk = this.opts.dllChunk;
  if (manifestDll && typeof manifestDll === 'boolean') {
    return this.normalizeFile(normalizeManifest, this.opts.host, this.opts.proxy);
  } else {
    let commonsChunk = [];
    if(dllChunk) { // for webpack4 4.2.0
      const dll = dllChunk.dll;
      const names = dllChunk.names;
      const chunks = dllChunk.chunks;
      chunks.forEach(chunk => {
        normalizeManifest[chunk.id] = chunk.outputPath;
      });
      commonsChunk = [].concat(dll);
    } else if (dllConfig && dllDir) { // 合并 dll manifest 到 manifest for webpack3
      const dllArray = Array.isArray(dllConfig) ? dllConfig : [dllConfig];
      dllArray.forEach(item => {
        const newDllManifestPath = path.join(dllDir, `manifest-${item.name}.json`);
        const oldDllManifestPath = path.join(dllDir, `config/manifest-${item.name}.json`);
        let dllManifest;
        if (fs.existsSync(newDllManifestPath)) {
          dllManifest= require(newDllManifestPath);
        } else if (fs.existsSync(oldDllManifestPath)) {
          dllManifest= require(oldDllManifestPath);
        }
        if(dllManifest) {
          Object.keys(dllManifest).forEach(key => {
            normalizeManifest[key] = dllManifest[key];
          });
          commonsChunk.push(item);
        }
      });
    }
    commonsChunk = commonsChunk.concat(this.opts.commonsChunk);
    publicPath = this.opts.proxy ? publicPath.replace(this.opts.host, '') : publicPath;
    const depsManifest = this.getDeps(webpackConfig, normalizeManifest, commonsChunk);
    return Object.assign({}, normalizeManifest, {
      deps: depsManifest,
      info: { publicPath, buildPath, mapped: true}
    });
  }
};


ManifestPlugin.prototype.emit = function(moduleAssets, compilation, compileCallback) {
  var seed = this.opts.seed || {};
  var webpackConfig = compilation.options;
  var publicPath = webpackConfig.output.publicPath;
  var files = compilation.chunks.reduce((files, chunk) => {
    return chunk.files.reduce((files, path) => {
      var name = (chunk.name ? chunk.name : 'chunk/' + chunk.id) + '.' + this.getFileType(path);
      return files.concat({
        path: path,
        chunk: chunk,
        name: name,
        isChunk: true,
        isAsset: false,
        isModuleAsset: false
      });
    }, files);
  }, []);
  // module assets don't show up in assetsByChunkName.
  // we're getting them this way;
  var stats = compilation.getStats().toJson({
    // Disable data generation of everything we don't use
    version:     false,
    hash:        false,
    timings:     false,
    builtAt:     false,
    env:         false,
    publicPath:  false,
    outputPath:  false,
    entrypoints: false,
    chunks:      false,
    chunkGroups: false,
    children:    false,
    modules:     false,
    assets: true,
  });
  files = stats.assets.reduce((files, asset) => {
    var name = moduleAssets[asset.name];
    if (name) {
      return files.concat({
        path: asset.name,
        name: name,
        isInitial: false,
        isChunk: false,
        isAsset: true
      });
    }
    return files;
  }, files);
  files = files.filter(file => {
    // Don't add hot updates to manifest
    return file.path.indexOf('hot-update') === -1;
  });
  // Append optional basepath onto all references.
  // This allows output path to be reflected in the manifest.
  if (this.opts.basePath) {
    files = files.map(file => {
      file.name = this.opts.basePath + file.name;
      return file;
    });
  }

  if (publicPath) {
    // Similar to basePath but only affects the value (similar to how
    // output.publicPath turns require('foo/bar') into '/public/foo/bar', see
    // https://github.com/webpack/docs/wiki/configuration#outputpublicpath
    files = files.map(file => {
      file.path = publicPath + file.path;
      return file;
    });
  }

  files = files.map(file => {
    file.name = file.name.replace(/\\/g, '/');
    file.path = file.path.replace(/\\/g, '/');
    return file;
  });

  if (this.opts.filter) {
    files = files.filter(this.opts.filter);
  }

  if (this.opts.map) {
    files = files.map(this.opts.map);
  }

  if (this.opts.sort) {
    files = files.sort(this.opts.sort);
  }

  var manifest;
  if (this.opts.generate) {
    manifest = this.opts.generate(seed, files);
  } else {
    manifest = files.reduce((manifest, file) => {
      manifest[file.name] = file.path;
      return manifest;
    }, seed);
  }

  var resource = this.getResource(webpackConfig, manifest, publicPath);
  var json = JSON.stringify(resource, null, 2);
  var outputFolder = webpackConfig.output.path;
  var outputFile = this.opts.filepath ? this.opts.filepath : path.resolve(compilation.options.output.path, this.opts.fileName);
  var outputName = this.opts.filepath ? path.basename(this.opts.filepath) : path.relative(outputFolder, outputFile);

  if (this.opts.assets) {
    compilation.assets[outputName] = {
      source: function() {
        return json;
      },
      size: function() {
        return json.length;
      }
    };
  }

  if (this.opts.writeToFileEmit) {
    fse.outputFileSync(outputFile, json);
  }

  // NOTE: make sure webpack is not writing multiple manifests simultaneously
  // lock(function(release) {
  //   if (compiler.hooks) {
  //     compiler.hooks.afterEmit.tap('ManifestResourcePlugin', compilation => {
  //       release();
  //     });
  //   } else {
  //     compiler.plugin('after-emit', (compilation, cb) => {
  //       release();
  //       cb();
  //     });
  //     compilation.applyPluginsAsync('webpack-manifest-resource-plugin-after-emit', manifest, compileCallback);
  //   }
  // });
};

ManifestPlugin.prototype.apply = function(compiler) {
  var moduleAssets = {};
  var moduleAsset = function (module, file) {
    if (module.userRequest) {
      moduleAssets[file] = path.join(
        path.dirname(file),
        path.basename(module.userRequest)
      );
    }
  };

  if (compiler.hooks) {
    compiler.hooks.compilation.tap('ManifestResourcePlugin', compilation => {
      compilation.hooks.moduleAsset.tap('ManifestResourcePlugin', moduleAsset);
    });
    compiler.hooks.emit.tap('ManifestResourcePlugin', (compilation, compileCallback) => {
      this.emit(moduleAssets, compilation, compileCallback);
    });
  } else {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('module-asset', moduleAsset);
    });
    compiler.plugin('emit', (compilation, compileCallback) => {
      this.emit(moduleAssets, compilation, compileCallback);
    });
  }
};

module.exports = ManifestPlugin;