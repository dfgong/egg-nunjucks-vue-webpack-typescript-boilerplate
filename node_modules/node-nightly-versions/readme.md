# node-nightly-versions [![Build Status](https://travis-ci.org/hemanth/node-nightly-versions.svg?branch=master)](https://travis-ci.org/hemanth/node-nightly-versions)

> Get the list of os/nightly node versions.


## Install

```
$ npm install --save node-nightly-versions
```


## Usage

```js
nodeNightlyversions()
.then(versions => versions['linux-x64'].version) // v7.0.0-nightly201608074c86fa30d8
.catch(console.error);
```

P.S: keys of versions:

```js
[ 'headers',
  'linux-x64',
  'linux-x86',
  'osx-x64-pkg',
  'osx-x64-tar',
  'osx-x86-tar',
  'src',
  'sunos-x64',
  'sunos-x86',
  'win-x64-exe',
  'win-x86-exe',
  'win-x86-msi' ]
```

P.P.S: If `process.env.NODEJS_ORG_NIGHTLY_MIRROR` is set, it shall pick-up that URL.

## License

MIT © [Hemanth.HM](https://h3manth.com)
