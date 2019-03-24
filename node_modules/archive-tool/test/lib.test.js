'use strict';
const path = require('path');
const fs = require('fs-extra');
const expect = require('chai').expect;
// http://chaijs.com/api/bdd/
const Archive = require('../');
describe('lib.test.js', () => {
  before(() => {
  });

  after(() => {
  });

  beforeEach(() => {
  });

  afterEach(() => {
  });

  describe('#expect lib test', () => {
    it('should test', () => {
      expect(undefined).to.be.undefined;
      expect([1,2,3]).to.have.property(1);
      expect(['.js','.jsx','.vue']).to.include.members(['.js','.jsx']);
      expect({id: 1, name: 'sky'}).to.include.all.keys(['id', 'name']);
    });
    it('should default options test', () => {
      const archive = new Archive();
      expect(archive.config.cwd).to.be.equal(process.cwd());
      expect(archive.config.installNode).to.be.false;
    });
    it('should set options test', () => {
      const archive = new Archive({
        cwd: __dirname,
        installNode: true,
        source: ['test'],
        installDeps: {
          mode: 'yarn',
          registry: undefined
        }
      });
      expect(archive.config.cwd).to.be.equal(__dirname);
      expect(archive.config.installNode).to.be.true;
      expect(archive.config.installDeps.mode).to.equal('yarn');
      expect(archive.config.installDeps.registry).to.equal(undefined);
    });
    it('should copy file test', () => {
      const archive = new Archive();
      const target = archive.config.target;
      archive.copyFile(['index.js', 'lib'], target);
      expect(fs.existsSync(path.join(target, 'index.js'))).to.be.true;
      expect(fs.existsSync(path.join(target, 'lib/index.js'))).to.be.true;
      fs.removeSync(path.join(target, 'index.js'));
      fs.removeSync(path.join(target, 'lib/index.js'));
    });
    it('should install deps test', () => {
      const archive = new Archive();
      const target = archive.config.target;
      archive.copyFile(['package.json'], target);
      expect(fs.existsSync(path.join(target, 'package.json'))).to.be.true;
      archive.installDeps();
      expect(fs.existsSync(path.join(target, 'node_modules/chalk'))).to.be.true;
      fs.removeSync(path.join(target, 'package.json'));
      fs.removeSync(path.join(target, 'node_modules'));
    });
    it('should install node test', function *() {
      const archive = new Archive();
      const target = archive.config.target;
      yield archive.installNode().then(() => {
        expect(fs.existsSync(path.join(target, 'node'))).to.be.true;
        fs.removeSync(path.join(target, 'node_modules'));
      }).catch(err => {
        throw err;
      });;
    });
    it('should archive zip file test', () => {
      const archive = new Archive();
      const target = path.join(archive.config.target, archive.config.filename, 'dist');
      archive.copyFile(['index.js', 'lib'], target);
      const targetFile = path.join(archive.config.target, archive.config.filename, `${archive.config.filename}.${archive.config.format}`)
      archive.archive(target, targetFile, {}, filepath => {
        expect(fs.existsSync(filepath)).to.be.true;
      });
    });
    it('should archive tar file test', () => {
      const archive = new Archive({ format: 'tar' });
      const target = path.join(archive.config.target, archive.config.filename, 'dist');
      archive.copyFile(['index.js', 'lib'], target);
      const targetFile = path.join(archive.config.target, archive.config.filename, `${archive.config.filename}.${archive.config.format}`)
      archive.archive(target, targetFile, {}, filepath => {
        expect(fs.existsSync(filepath)).to.be.true;
      });
    });
    it('should archive zip flow file test', () => {
      const archive = new Archive();
      archive.zip(filepath => {
        expect(fs.existsSync(filepath)).to.be.true;
      });
    });
    it('should archive zip flow installNode test', () => {
      const archive = new Archive({ installNode: true });
      archive.zip(filepath => {
        expect(fs.existsSync(path.join(archive.config.target, archive.config.filename, 'dist', 'node_modules', 'node'))).to.be.true;
        expect(fs.existsSync(filepath)).to.be.true;
      });
    });
    it('should archive tar flow file test', () => {
      const archive = new Archive();
      archive.tar(filepath => {
        expect(fs.existsSync(filepath)).to.be.true;
      });
    });
  });
});