import * as vscode from 'vscode';
import { WordTeleporterExtension as WordTeleporter } from './cursorTeleporter/wordTeleporter';
import { LineTeleporterExtension as LineTeleporter } from './cursorTeleporter/lineTeleporter';

export async function activate(context: vscode.ExtensionContext) {
	const wt = new WordTeleporter();
	const lt = new LineTeleporter();

	let wordTeleporter = vscode.commands.registerCommand('teleporter.wordTeleporter', () => {
		if (!wt.isModeOn && !lt.isModeOn) {
			wt.run();
		}
	});

	let lineTeleporter = vscode.commands.registerCommand('teleporter.lineTeleporter', () => {
		if (!wt.isModeOn && !lt.isModeOn) {
			lt.run();
		}
	});

	context.subscriptions.push(wordTeleporter, lineTeleporter);
}
