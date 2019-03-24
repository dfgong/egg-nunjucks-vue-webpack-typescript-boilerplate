import { TsGenConfig, TsHelperConfig } from '..';
export interface ImportItem {
    import: string;
    declaration: string;
    moduleName: string;
}
export declare const defaultConfig: {
    pattern: string;
    interface: string;
};
export default function (config: TsGenConfig, baseConfig: TsHelperConfig): {
    dist: string;
    content?: undefined;
} | {
    dist: string;
    content: string;
};
export declare function checkConfigReturnType(f: string): 2 | 1 | 3 | undefined;
//# sourceMappingURL=config.d.ts.map