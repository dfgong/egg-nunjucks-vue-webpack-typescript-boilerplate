"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const enquirer_1 = require("enquirer");
const utils = tslib_1.__importStar(require("../utils"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const __1 = require("../");
const TYPE_TS = 'typescript';
const TYPE_JS = 'javascript';
class InitCommand {
    constructor() {
        this.description = 'Init egg-ts-helper in your existing project';
        this.options = '<type>';
    }
    async run(_, { args, cwd }) {
        let type = args[1];
        const pkgInfo = utils.getPkgInfo(cwd);
        const typeList = [TYPE_TS, TYPE_JS];
        pkgInfo.egg = pkgInfo.egg || {};
        // verify type
        if (!typeList.includes(type)) {
            const result = await enquirer_1.prompt({
                type: 'autocomplete',
                name: 'type',
                message: 'Choose the type of your project',
                choices: utils.checkMaybeIsJsProj(cwd) ? typeList.reverse() : typeList,
            }).catch(() => {
                utils.log('cancel initialization');
                return { type: '' };
            });
            type = result.type;
        }
        if (type === TYPE_JS) {
            // create jsconfig.json
            const result = utils.writeJsConfig(cwd);
            if (result) {
                utils.log('create ' + result);
            }
        }
        else if (type === TYPE_TS) {
            pkgInfo.egg.typescript = true;
            // create tsconfig.json
            const result = utils.writeTsConfig(cwd);
            if (result) {
                utils.log('create ' + result);
            }
        }
        else {
            return;
        }
        // add egg-ts-helper/register to egg.require
        pkgInfo.egg.require = pkgInfo.egg.require || [];
        if (!pkgInfo.egg.require.includes('egg-ts-helper/register')) {
            pkgInfo.egg.require.push('egg-ts-helper/register');
        }
        // write package.json
        const pkgDist = path_1.default.resolve(cwd, './package.json');
        fs_1.default.writeFileSync(pkgDist, JSON.stringify(pkgInfo, null, 2));
        utils.log('change ' + pkgDist);
        // build once
        utils.log('create d.ts ...');
        __1.createTsHelperInstance({ cwd }).build();
        utils.log('complete initialization');
    }
}
exports.default = new InitCommand();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbWQvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMsd0RBQWtDO0FBQ2xDLHdEQUF3QjtBQUN4QixvREFBb0I7QUFDcEIsMkJBQTZDO0FBRTdDLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQztBQUM3QixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFFN0IsTUFBTSxXQUFXO0lBQWpCO1FBQ0UsZ0JBQVcsR0FBRyw2Q0FBNkMsQ0FBQztRQUU1RCxZQUFPLEdBQUcsUUFBUSxDQUFDO0lBMERyQixDQUFDO0lBeERDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBb0I7UUFDMUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsTUFBTSxRQUFRLEdBQUcsQ0FBRSxPQUFPLEVBQUUsT0FBTyxDQUFFLENBQUM7UUFFdEMsT0FBTyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUVoQyxjQUFjO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBTSxDQUFtQjtnQkFDNUMsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxpQ0FBaUM7Z0JBQzFDLE9BQU8sRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUN2RSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDWixLQUFLLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztTQUNwQjtRQUVELElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUNwQix1QkFBdUI7WUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNGO2FBQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUU5Qix1QkFBdUI7WUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNGO2FBQU07WUFDTCxPQUFPO1NBQ1I7UUFFRCw0Q0FBNEM7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsRUFBRTtZQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUNwRDtRQUVELHFCQUFxQjtRQUNyQixNQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BELFlBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLGFBQWE7UUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0IsMEJBQXNCLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLFdBQVcsRUFBRSxDQUFDIn0=