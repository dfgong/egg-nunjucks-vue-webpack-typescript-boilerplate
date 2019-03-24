import { TsGenConfig, TsHelperConfig } from '..';
export declare const defaultConfig: {
    interface: {
        context: string;
        application: string;
        agent: string;
        request: string;
        response: string;
        helper: string;
    };
};
export default function (config: TsGenConfig, baseConfig: TsHelperConfig): {
    dist: string;
}[];
//# sourceMappingURL=extend.d.ts.map