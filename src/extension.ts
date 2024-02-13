import * as vscode from 'vscode';
import { WordTeleporterExtension as WordTeleporter } from './teleporter/word_teleporter';
import { LineTeleporterExtension as LineTeleporter } from './teleporter/line_teleporter';

export function activate(context: vscode.ExtensionContext) {
	const wt = new WordTeleporter();
	const lt = new LineTeleporter();

	// Word Teleporter
	let wordTeleporter = vscode.commands.registerCommand('teleporter.wordTeleporter', () => {
		const startTime = performance.now();

		if (!wt.isModeOn && !lt.isModeOn) {
			wt.run();
		}
		const endTime = performance.now();
		const executionTimeInSeconds = (endTime - startTime) / 1000;
		vscode.window.showInformationMessage(`${executionTimeInSeconds.toString()} seconds`);
	});

	// Line Teleporter
	let lineTeleporter = vscode.commands.registerCommand('teleporter.lineTeleporter', () => {
		const startTime = performance.now();

		if (!wt.isModeOn && !lt.isModeOn) {
			lt.run();
		}
		const endTime = performance.now();
		const executionTimeInSeconds = (endTime - startTime) / 1000;
		vscode.window.showInformationMessage(`${executionTimeInSeconds.toString()} seconds`);
	});

	context.subscriptions.push(wordTeleporter, lineTeleporter);
}
