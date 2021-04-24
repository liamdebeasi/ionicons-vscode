import * as vscode from 'vscode';

const enum LogLevel {
    Info,
    Debug,
    Off
}

const LOG_LEVEL_SETTING = 'logLevel';

class Log {
    private _outputChannel: vscode.OutputChannel;
    private _logLevel!: LogLevel;
    private _disposable: vscode.Disposable;

    constructor() {
        this._outputChannel = vscode.window.createOutputChannel('ionicons');

        this._disposable = vscode.workspace.onDidChangeConfiguration(() => {
            this.getLogLevel();
        });

        this.getLogLevel();
    }

    public appendLine(message: string, component?: string, showChannel = true) {
        if (showChannel) {
            this._outputChannel.show();
        }

        switch (this._logLevel) {
            case LogLevel.Off:
                return;
            case LogLevel.Debug:
                const hrtime = process.hrtime();
                const timeStamp = `${hrtime[0]}s ${Math.floor(hrtime[1] / 1000000)}ms`;
                const info = component ? `${component}> ${message}` : `${message}`;
                this._outputChannel.appendLine(`[Debug ${timeStamp}] ${info}`);
                return;
            case LogLevel.Info:
            default:
                this._outputChannel.appendLine(`[Info] ` + (component ? `[${component}] ${message}` : `${message}`));
                return;
        }
    }

    public debug(message: string, component: string) {
        if (this._logLevel === LogLevel.Debug) {
            this.appendLine(message, component);
        }
    }

    public dispose() {
        if (this._disposable) {
            this._disposable.dispose();
        }
    }

    private getLogLevel() {
        const logLevel = vscode.workspace.getConfiguration('ionicons').get<string>(LOG_LEVEL_SETTING);
        switch (logLevel) {
            case 'debug':
                this._logLevel = LogLevel.Debug;
                break;
            case 'off':
                this._logLevel = LogLevel.Off;
                break;
            case 'info':
            default:
                this._logLevel = LogLevel.Info;
                break;
        }
    }
}

const Logger = new Log();
export default Logger;