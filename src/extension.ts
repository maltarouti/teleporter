import * as vscode from 'vscode';
import { WordTeleporterExtension as WordTeleporter } from './word_teleporter/word_teleporter';

export function activate(context: vscode.ExtensionContext) {
	const wt = new WordTeleporter();
	let wordTeleporter = vscode.commands.registerCommand('teleporter.wordTeleporter', () => {
		const startTime = performance.now();
		wt.run();
		const endTime = performance.now();
		const executionTimeInSeconds = (endTime - startTime) / 1000;
		vscode.window.showInformationMessage(`${executionTimeInSeconds.toString()} seconds`);
	});
	context.subscriptions.push(wordTeleporter);
}
