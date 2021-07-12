// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createFilePath, fileExists, saveFileInDir } from './icons-files-manager';
import { iconLoader } from './icons-loader';
import { IonIconsDecorations, setDecorations } from './ion-icons-decorations';
import Logger from './logger';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ionicons" is now active!');

	// const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
	// 	vscode.StatusBarAlignment.Left,
	// 	100,
	// );

	// statusBarItem.text = 'Toggle icon';
	// statusBarItem.command = 'extension.downloadIcons';
	// statusBarItem.show();

	statusBarItem.text = 'Toggle icon';
	statusBarItem.command = 'extension.downloadIcons';
	statusBarItem.show();

	const iconDisposable = new IonIconsDecorations(context.globalStorageUri.path);

	context.subscriptions.push(iconDisposable);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.downloadIcons', () => {
		iconDisposable.update();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
