"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_1 = tslib_1.__importDefault(require("./class"));
function default_1(config, baseConfig) {
    config.interfaceHandle = config.interfaceHandle || 'AutoInstanceType<typeof {{ 0 }}>';
    const result = class_1.default(config, baseConfig);
    /* istanbul ignore else */
    if (result.content) {
        result.content = [
            'type AutoInstanceType<T, U = T extends (...args: any[]) => any ? ReturnType<T> : T> = U extends { new (...args: any[]): any } ? InstanceType<U> : U;',
            result.content,
        ].join('\n');
    }
    return result;
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmF0b3JzL2F1dG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNERBQStCO0FBRS9CLG1CQUF3QixNQUFtQixFQUFFLFVBQTBCO0lBQ3JFLE1BQU0sQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSxrQ0FBa0MsQ0FBQztJQUV0RixNQUFNLE1BQU0sR0FBRyxlQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLDBCQUEwQjtJQUMxQixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDbEIsTUFBTSxDQUFDLE9BQU8sR0FBRztZQUNmLHNKQUFzSjtZQUN0SixNQUFNLENBQUMsT0FBTztTQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBYkQsNEJBYUMifQ==