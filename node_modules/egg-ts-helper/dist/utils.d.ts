import ts from 'typescript';
export declare const JS_CONFIG: {
    include: string[];
};
export declare const TS_CONFIG: {
    compilerOptions: {
        target: string;
        module: string;
        strict: boolean;
        noImplicitAny: boolean;
        experimentalDecorators: boolean;
        emitDecoratorMetadata: boolean;
        allowSyntheticDefaultImports: boolean;
        charset: string;
        allowJs: boolean;
        pretty: boolean;
        lib: string[];
        noEmitOnError: boolean;
        noUnusedLocals: boolean;
        noUnusedParameters: boolean;
        allowUnreachableCode: boolean;
        allowUnusedLabels: boolean;
        strictPropertyInitialization: boolean;
        noFallthroughCasesInSwitch: boolean;
        skipLibCheck: boolean;
        skipDefaultLibCheck: boolean;
        inlineSourceMap: boolean;
    };
};
export declare function convertString<T>(val: string | undefined, defaultVal: T): T;
export declare function loadFiles(cwd: string, pattern?: string): string[];
export declare function writeJsConfig(cwd: string): string | undefined;
export declare function writeTsConfig(cwd: string): string | undefined;
export declare function checkMaybeIsJsProj(cwd: string): boolean;
export declare function loadModules<T = any>(cwd: string, loadDefault?: boolean): {
    [key: string]: T;
};
export declare function strToFn(fn: any): any;
export declare function log(msg: string, prefix?: boolean): void;
export declare function getAbsoluteUrlByCwd(p: string, cwd: string): string;
export declare function getImportStr(from: string, to: string, moduleName?: string, importStar?: boolean): string;
export declare function writeFileSync(fileUrl: any, content: any): void;
export declare function cleanJs(cwd: string): void;
export declare function getModuleObjByPath(f: string): {
    props: string[];
    moduleName: string;
};
export declare function removeSameNameJs(f: string): string | undefined;
export declare function findExportNode(code: string): {
    exportDefaultNode: ts.Node | undefined;
    exportNodeList: ts.Node[];
};
export declare function modifierHas(node: ts.Node, kind: any): ts.Token<ts.SyntaxKind.AbstractKeyword> | ts.Token<ts.SyntaxKind.AsyncKeyword> | ts.Token<ts.SyntaxKind.ConstKeyword> | ts.Token<ts.SyntaxKind.DeclareKeyword> | ts.Token<ts.SyntaxKind.DefaultKeyword> | ts.Token<ts.SyntaxKind.ExportKeyword> | ts.Token<ts.SyntaxKind.PublicKeyword> | ts.Token<ts.SyntaxKind.PrivateKeyword> | ts.Token<ts.SyntaxKind.ProtectedKeyword> | ts.Token<ts.SyntaxKind.ReadonlyKeyword> | ts.Token<ts.SyntaxKind.StaticKeyword> | undefined;
export declare function eachSourceFile(node: ts.Node, cb: (n: ts.Node) => any): void;
export declare function resolveModule(url: any): string | undefined;
export declare function moduleExist(mod: string, cwd?: string): string | true | undefined;
export declare function requireFile(url: any): any;
export declare function getPkgInfo(cwd: string): any;
export declare function formatProp(prop: string): string;
export declare function camelProp(property: string, caseStyle: string | ((...args: any[]) => string)): string;
//# sourceMappingURL=utils.d.ts.map