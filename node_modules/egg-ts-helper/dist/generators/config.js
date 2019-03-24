"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const utils = tslib_1.__importStar(require("../utils"));
const EXPORT_DEFAULT_FUNCTION = 1;
const EXPORT_DEFAULT = 2;
const EXPORT = 3;
const cache = {};
exports.defaultConfig = {
    // only need to parse config.default.ts or config.ts
    pattern: 'config(.default|).(ts|js)',
    interface: 'EggAppConfig',
};
function default_1(config, baseConfig) {
    const fileList = config.fileList;
    const dist = path_1.default.resolve(config.dtsDir, 'index.d.ts');
    if (!fileList.length) {
        return { dist };
    }
    const importList = [];
    const declarationList = [];
    const moduleList = [];
    fileList.forEach(f => {
        const abUrl = path_1.default.resolve(config.dir, f);
        // read from cache
        if (!cache[abUrl] || config.file === abUrl) {
            const type = checkConfigReturnType(abUrl);
            const { moduleName: sModuleName } = utils.getModuleObjByPath(f);
            const moduleName = `Export${sModuleName}`;
            const importContext = utils.getImportStr(config.dtsDir, abUrl, moduleName, type === EXPORT);
            let tds = `type ${sModuleName} = `;
            if (type === EXPORT_DEFAULT_FUNCTION) {
                tds += `ReturnType<typeof ${moduleName}>;`;
            }
            else if (type === EXPORT_DEFAULT || type === EXPORT) {
                tds += `typeof ${moduleName};`;
            }
            else {
                return;
            }
            // cache the file
            cache[abUrl] = {
                import: importContext,
                declaration: tds,
                moduleName: sModuleName,
            };
        }
        const cacheItem = cache[abUrl];
        importList.push(cacheItem.import);
        declarationList.push(cacheItem.declaration);
        moduleList.push(cacheItem.moduleName);
    });
    if (!importList.length) {
        return { dist };
    }
    const newConfigType = `New${config.interface}`;
    return {
        dist,
        content: `import { ${config.interface} } from '${baseConfig.framework}';\n` +
            `${importList.join('\n')}\n` +
            `${declarationList.join('\n')}\n` +
            `declare module '${baseConfig.framework}' {\n` +
            `  type ${newConfigType} = ${moduleList.join(' & ')};\n` +
            `  interface ${config.interface} extends ${newConfigType} { }\n` +
            '}',
    };
}
exports.default = default_1;
// check config return type.
function checkConfigReturnType(f) {
    const result = utils.findExportNode(fs_1.default.readFileSync(f, 'utf-8'));
    if (result.exportDefaultNode) {
        return typescript_1.default.isFunctionLike(result.exportDefaultNode)
            ? EXPORT_DEFAULT_FUNCTION
            : EXPORT_DEFAULT;
    }
    else if (result.exportNodeList.length) {
        return EXPORT;
    }
}
exports.checkConfigReturnType = checkConfigReturnType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9EQUFvQjtBQUNwQix3REFBd0I7QUFDeEIsb0VBQTRCO0FBRTVCLHdEQUFrQztBQUVsQyxNQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQztBQUNsQyxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDekIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLE1BQU0sS0FBSyxHQUFrQyxFQUFFLENBQUM7QUFRbkMsUUFBQSxhQUFhLEdBQUc7SUFDM0Isb0RBQW9EO0lBQ3BELE9BQU8sRUFBRSwyQkFBMkI7SUFDcEMsU0FBUyxFQUFFLGNBQWM7Q0FDMUIsQ0FBQztBQUVGLG1CQUF3QixNQUFtQixFQUFFLFVBQTBCO0lBQ3JFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ3BCLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNqQjtJQUVELE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUNoQyxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7SUFDckMsTUFBTSxVQUFVLEdBQWEsRUFBRSxDQUFDO0lBQ2hDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkIsTUFBTSxLQUFLLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFDLGtCQUFrQjtRQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lB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