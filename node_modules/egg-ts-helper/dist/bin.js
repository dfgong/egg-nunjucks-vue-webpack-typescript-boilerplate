#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const commander_1 = require("commander");
const assert_1 = tslib_1.__importDefault(require("assert"));
const package_json_1 = tslib_1.__importDefault(require("../package.json"));
const _1 = require("./");
const utils_1 = require("./utils");
const commands = utils_1.loadModules(path_1.default.resolve(__dirname, './cmd'), true);
let executeCmd;
// override executeSubCommand to support async subcommand.
commander_1.Command.prototype.addImplicitHelpCommand = () => { };
commander_1.Command.prototype.executeSubCommand = async function (argv, args, unknown) {
    const cwd = this.cwd || _1.defaultConfig.cwd;
    const command = commands[executeCmd];
    assert_1.default(command, executeCmd + ' does not exist');
    await command.run(this, { cwd, argv, args: args.filter(item => item !== this), unknown });
};
const program = new commander_1.Command()
    .version(package_json_1.default.version, '-v, --version')
    .usage('[commands] [options]')
    .option('-w, --watch', 'Watching files, d.ts would recreated while file changed')
    .option('-c, --cwd [path]', 'Egg application base dir (default: process.cwd)')
    .option('-C, --config [path]', 'Configuration file, The argument can be a file path to a valid JSON/JS configuration file.（default: {cwd}/tshelper.js')
    .option('-f, --framework [name]', 'Egg framework(default: egg)')
    .option('-o, --oneForAll [path]', 'Create a d.ts import all types (default: typings/ets.d.ts)')
    .option('-s, --silent', 'Running without output')
    .option('-i, --ignore [dirs]', 'Ignore watchDirs, your can ignore multiple dirs with comma like: -i controller,service')
    .option('-e, --enabled [dirs]', 'Enable watchDirs, your can enable multiple dirs with comma like: -e proxy,other')
    .option('-E, --extra [json]', 'Extra config, the value should be json string');
if (!process.argv.slice(2).length) {
    execute();
}
else {
    Object.keys(commands).forEach(cmd => {
        const subCommand = commands[cmd];
        const cmdName = subCommand.options ? `${cmd} ${subCommand.options}` : cmd;
        program.command(cmdName, subCommand.description)
            .action(command => executeCmd = command);
    });
    program.parse(process.argv);
    if (!executeCmd) {
        execute();
    }
}
// execute fn
function execute() {
    const watchFiles = program.watch;
    const watchDirs = {};
    (program.ignore || '').split(',').forEach(key => (watchDirs[key] = false));
    (program.enabled || '').split(',').forEach(key => (watchDirs[key] = true));
    const tsHelperConfig = Object.assign({ cwd: program.cwd || _1.defaultConfig.cwd, framework: program.framework, watch: watchFiles, watchDirs, configFile: program.config }, (program.extra ? JSON.parse(program.extra) : {}));
    // silent
    if (program.silent) {
        tsHelperConfig.silent = true;
    }
    // create instance
    const tsHelper = _1.createTsHelperInstance(tsHelperConfig).build();
    if (program.oneForAll) {
        // create one for all
        tsHelper.createOneForAll(program.oneForAll);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Jpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsd0RBQXdCO0FBQ3hCLHlDQUFvQztBQUNwQyw0REFBNEI7QUFDNUIsMkVBQXVDO0FBQ3ZDLHlCQUEyRDtBQUMzRCxtQ0FBc0M7QUFDdEMsTUFBTSxRQUFRLEdBQUcsbUJBQVcsQ0FBYSxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRixJQUFJLFVBQThCLENBQUM7QUFFbkMsMERBQTBEO0FBQzFELG1CQUFPLENBQUMsU0FBUyxDQUFDLHNCQUFzQixHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztBQUNwRCxtQkFBTyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLFdBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPO0lBQ3RFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksZ0JBQWEsQ0FBQyxHQUFHLENBQUM7SUFDMUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVcsQ0FBQyxDQUFDO0lBQ3RDLGdCQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDNUYsQ0FBQyxDQUFDO0FBRUYsTUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBTyxFQUFFO0tBQzFCLE9BQU8sQ0FBQyxzQkFBUSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7S0FDMUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDO0tBQzdCLE1B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