"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const utils = tslib_1.__importStar(require("../utils"));
const cache = {};
exports.defaultConfig = {
    pattern: 'plugin*.(ts|js)',
};
function default_1(config, baseConfig) {
    const fileList = config.fileList;
    const dist = path_1.default.resolve(config.dtsDir, 'plugin.d.ts');
    if (!fileList.length) {
        return { dist };
    }
    let importList = [];
    fileList.forEach(f => {
        const abUrl = path_1.default.resolve(config.dir, f);
        // read from cache
        if (!cache[abUrl] || config.file === abUrl) {
            const exportResult = utils.findExportNode(fs_1.default.readFileSync(abUrl, 'utf-8'));
            if (!exportResult) {
                return;
            }
            // collect package name
            const collectPackageName = (property) => {
                let packageIsEnable = true;
                let packageName;
                property.properties.forEach(prop => {
                    if (typescript_1.default.isPropertyAssignment(prop) && typescript_1.default.isIdentifier(prop.name)) {
                        if (prop.name.escapedText === 'package') {
                            // { package: 'xxx' }
                            packageName = typescript_1.default.isStringLiteral(prop.initializer)
                                ? prop.initializer.text
                                : undefined;
                        }
                        else if (prop.name.escapedText === 'enable' &&
                            prop.initializer.kind === typescript_1.default.SyntaxKind.FalseKeyword) {
                            // { enable: false }
                            packageIsEnable = false;
                        }
                    }
                });
                if (packageName &&
                    packageIsEnable &&
                    utils.moduleExist(packageName, baseConfig.cwd)) {
                    importList.push(packageName);
                }
            };
            // check return node
            if (exportResult.exportDefaultNode) {
                // export default {  }
                if (typescript_1.default.isObjectLiteralExpression(exportResult.exportDefaultNode)) {
                    for (const property of exportResult.exportDefaultNode.properties) {
                        if (typescript_1.default.isPropertyAssignment(property) &&
                            typescript_1.default.isObjectLiteralExpression(property.initializer)) {
                            collectPackageName(property.initializer);
                        }
                    }
                }
            }
            else if (exportResult.exportNodeList.length) {
                // export const xxx = {};
                for (const property of exportResult.exportNodeList) {
                    if (typescript_1.default.isBinaryExpression(property) &&
                        typescript_1.default.isObjectLiteralExpression(property.right)) {
                        collectPackageName(property.right);
                    }
                    else if (typescript_1.default.isVariableDeclaration(property) &&
                        property.initializer &&
                        typescript_1.default.isObjectLiteralExpression(property.initializer)) {
                        collectPackageName(property.initializer);
                    }
                }
            }
        }
        else {
            importList = importList.concat(cache[abUrl]);
        }
    });
    if (!importList.length) {
        return { dist };
    }
    return {
        dist,
        // remove duplicate before map
        content: Array.from(new Set(importList))
            .map(p => `import '${p}';`)
            .join('\n'),
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9EQUFvQjtBQUNwQix3REFBd0I7QUFDeEIsb0VBQTRCO0FBRTVCLHdEQUFrQztBQUVsQyxNQUFNLEtBQUssR0FBZ0MsRUFBRSxDQUFDO0FBRWpDLFFBQUEsYUFBYSxHQUFHO0lBQzNCLE9BQU8sRUFBRSxpQkFBaUI7Q0FDM0IsQ0FBQztBQUVGLG1CQUF3QixNQUFtQixFQUFFLFVBQTBCO0lBQ3JFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ3BCLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNqQjtJQUVELElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUM5QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ25CLE1BQU0sS0FBSyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQyxrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtZQUMxQyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUN2QyxZQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FDaEMsQ0FBQztZQUNGLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2pCLE9BQU87YUFDUjtZQUVELHVCQUF1QjtZQUN2QixNQUFNLGtCQUFrQixHQUFHLENBQUMsUUFBb0MsRUFBRSxFQUFFO2dC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