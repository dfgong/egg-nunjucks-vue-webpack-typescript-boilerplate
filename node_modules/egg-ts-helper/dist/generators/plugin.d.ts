import { TsGenConfig, TsHelperConfig } from '..';
export declare const defaultConfig: {
    pattern: string;
};
export default function (config: TsGenConfig, baseConfig: TsHelperConfig): {
    dist: string;
    content?: undefined;
} | {
    dist: string;
    content: string;
};
//# sourceMappingURL=plugin.d.ts.map