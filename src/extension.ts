import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('teleporter.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from teleporter!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
