"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const utils = tslib_1.__importStar(require("../utils"));
const debug = debug_1.default('egg-ts-helper#generators_extend');
// default config
exports.defaultConfig = {
    interface: {
        context: 'Context',
        application: 'Application',
        agent: 'Agent',
        request: 'Request',
        response: 'Response',
        helper: 'IHelper',
    },
};
function default_1(config, baseConfig) {
    const fileList = config.file ? [config.file] : config.fileList;
    debug('file list : %o', fileList);
    if (!fileList.length) {
        // clean files
        return Object.keys(config.interface).map(key => ({
            dist: path_1.default.resolve(config.dtsDir, `${key}.d.ts`),
        }));
    }
    const tsList = [];
    fileList.forEach(f => {
        let basename = path_1.default.basename(f);
        basename = basename.substring(0, basename.lastIndexOf('.'));
        const moduleNames = basename.split('.');
        const interfaceNameKey = moduleNames[0];
        const interfaceEnvironment = moduleNames[1]
            ? moduleNames[1].replace(/^[a-z]/, r => r.toUpperCase())
            : '';
        const interfaceName = config.interface[interfaceNameKey];
        if (!interfaceName) {
            return;
        }
        const dist = path_1.default.resolve(config.dtsDir, `${basename}.d.ts`);
        f = path_1.default.resolve(config.dir, f);
        if (!fs_1.default.existsSync(f)) {
            return tsList.push({ dist });
        }
        // get import info
        const moduleName = `Extend${interfaceEnvironment}${interfaceName}`;
        const importContext = utils.getImportStr(config.dtsDir, f, moduleName);
        tsList.push({
            dist,
            content: `${importContext}\n` +
                `declare module \'${baseConfig.framework}\' {\n` +
                `  type ${moduleName}Type = typeof ${moduleName};\n` +
                `  interface ${interfaceName} extends ${moduleName}Type { }\n` +
                '}',
        });
    });
    return tsList;
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvZXh0ZW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBEQUFzQjtBQUN0QixvREFBb0I7QUFDcEIsd0RBQXdCO0FBQ3hCLHdEQUFrQztBQUVsQyxNQUFNLEtBQUssR0FBRyxlQUFDLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUVuRCxpQkFBaUI7QUFDSixRQUFBLGFBQWEsR0FBRztJQUMzQixTQUFTLEVBQUU7UUFDVCxPQUFPLEVBQUUsU0FBUztRQUNsQixXQUFXLEVBQUUsYUFBYTtRQUMxQixLQUFLLEVBQUUsT0FBTztRQUNkLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE1BQU0sRUFBRSxTQUFTO0tBQ2xCO0NBQ0YsQ0FBQztBQUVGLG1CQUF3QixNQUFtQixFQUFFLFVBQTBCO0lBQ3JFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBRWpFLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNwQixjQUFjO1FBQ2QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQUksRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLE9BQU8sQ0FBQztTQUNqRCxDQUFDLENBQUMsQ0FBQztLQUNMO0lBRUQsTUFBTSxNQUFNLEdBQXNCLEVBQUUsQ0FBQztJQUNyQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ25CLElBQUksUUFBUSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sb0JBQW9CLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVQLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU87U0FDUjtRQUVELE1BQU0sSUFBSSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsT0FBTyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlCO1FBRUQsa0JBQWtCO1FBQ2xCLE1BQU0sVUFBVSxHQUFHLFNBQVMsb0JBQW9CLEdBQUcsYUFBYSxFQUFFLENBQUM7UUFDbkUsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ1YsSUFBSTtZQUNKLE9BQU8sRUFDTCxHQUFHLGFBQWEsSUFBSTtnQkFDcEIsb0JBQW9CLFVBQVUsQ0FBQyxTQUFTLFFBQVE7Z0JBQ2hELFVBQVUsVUFBVSxpQkFBaUIsVUFBVSxLQUFLO2dCQUNwRCxlQUFlLGFBQWEsWUFBWSxVQUFVLFlBQVk7Z0JBQzlELEdBQUc7U0FDTixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUEvQ0QsNEJBK0NDIn0=