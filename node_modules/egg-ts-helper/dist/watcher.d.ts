/// <reference types="node" />
import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import { TsGenerator, TsHelperConfig, default as TsHelper } from './';
export interface BaseWatchItem {
    path: string;
    generator: string;
    enabled: boolean;
    trigger: Array<'add' | 'unlink' | 'change'>;
    pattern: string;
    watch: boolean;
}
export interface WatchItem extends PlainObject, BaseWatchItem {
}
interface WatcherOptions extends WatchItem {
    name: string;
}
export default class Watcher extends EventEmitter {
    helper: TsHelper;
    name: string;
    dir: string;
    options: WatcherOptions;
    dtsDir: string;
    config: TsHelperConfig;
    generator: TsGenerator;
    fsWatcher?: chokidar.FSWatcher;
    throttleTick: any;
    throttleStack: string[];
    constructor(options: WatcherOptions, helper: TsHelper);
    init(options: WatcherOptions): void;
    destroy(): void;
    watch(): void;
    execute(file?: string): any;
    private onChange;
    private getGenerator;
}
export {};
//# sourceMappingURL=watcher.d.ts.map