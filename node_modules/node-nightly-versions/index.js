'use strict';
const fetch = require('isomorphic-fetch');
const downloadStr = '/download/nightly/index.json'
const nodeURL = (process.env.NODEJS_ORG_NIGHTLY_MIRROR ||
                   'https://nodejs.org')
const nightlyURL = `${nodeURL}${downloadStr}`;

const files = [
	"headers",
	"linux-x64",
	"linux-x86",
	"osx-x64-pkg",
	"osx-x64-tar",
	"osx-x86-tar",
	"src",
	"sunos-x64",
	"sunos-x86",
	"win-x64-msi",
	"win-x86-msi",
];

module.exports = function () {
  return fetch(nightlyURL)
    .then(resp => resp.json())
    .then(releases => files.reduce((latestVersion, file) => {
      latestVersion[file] = releases.filter(release => release.files.indexOf(file)!==-1)[0];
      return latestVersion;
    },{}));
}
