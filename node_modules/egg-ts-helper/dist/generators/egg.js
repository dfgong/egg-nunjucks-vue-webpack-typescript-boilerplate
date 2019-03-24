"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
// declare global namespace Egg
function default_1(config, baseConfig) {
    return {
        dist: path_1.default.resolve(config.dtsDir, 'index.d.ts'),
        content: `export * from '${baseConfig.framework}';\n` +
            'export as namespace Egg;\n',
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWdnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvZWdnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdEQUF3QjtBQUV4QiwrQkFBK0I7QUFDL0IsbUJBQXdCLE1BQW1CLEVBQUUsVUFBMEI7SUFDckUsT0FBTztRQUNMLElBQUksRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO1FBQy9DLE9BQU8sRUFDTCxrQkFBa0IsVUFBVSxDQUFDLFNBQVMsTUFBTTtZQUM1Qyw0QkFBNEI7S0FDL0IsQ0FBQztBQUNKLENBQUM7QUFQRCw0QkFPQyJ9