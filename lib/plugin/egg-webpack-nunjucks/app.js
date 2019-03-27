/**
 * 实现本地开发webpack热更新内存存储读取
 */
const path = require('path');

module.exports = app => {
    if (app.view) {
        app.view.resolve = function (name) {
            return Promise.resolve(name);
        };
    }

    if (app.nunjucks) {
        app.nunjucks.render = async (filename, locals, cb) => {
            const filePath = path.isAbsolute(filename) ? filename : path.join(app.config.view.root[0], filename);
            const tpl = await app.webpack.fileSystem.readWebpackMemoryFile(filePath, filename);
            return app.nunjucks.renderString(tpl, locals, cb);
        };
    }
};