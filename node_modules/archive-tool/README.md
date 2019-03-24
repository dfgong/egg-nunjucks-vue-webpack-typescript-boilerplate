# archive-tool

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/archive-tool.svg?style=flat-square
[npm-url]: https://npmjs.org/package/archive-tool
[travis-image]: https://img.shields.io/travis/hubcarl/archive-tool.svg?style=flat-square
[travis-url]: https://travis-ci.org/hubcarl/archive-tool
[codecov-image]: https://img.shields.io/codecov/c/github/hubcarl/archive-tool.svg?style=flat-square
[codecov-url]: https://codecov.io/github/hubcarl/archive-tool?branch=master
[david-image]: https://img.shields.io/david/hubcarl/archive-tool.svg?style=flat-square
[david-url]: https://david-dm.org/hubcarl/archive-tool
[snyk-image]: https://snyk.io/test/npm/archive-tool/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/archive-tool
[download-image]: https://img.shields.io/npm/dm/archive-tool.svg?style=flat-square
[download-url]: https://npmjs.org/package/archive-tool

Archive files to zip/tar file

## Featues

- [x] archive files to zip/tar file
- [x] archive node project to zip file
- [x] archive node project to tar file
- [x] support install node into node_modules

**Node>8.6.0**

## Install

```bash
npm install archive-tool
```

## Usage

```js
const Archive = require('archive-tool');
const archive = new Archive({
  source: ['src', 'lib', 'package.json'],
  target: 'dist'
});
archive.zip();
```

## License

[MIT](LICENSE)
