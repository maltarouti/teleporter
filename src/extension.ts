import * as vscode from 'vscode';
import { WordTeleporterExtension as WordTeleporter } from './word_teleporter/word_teleporter';

export function activate(context: vscode.ExtensionContext) {
	let wordTeleporter = vscode.commands.registerCommand('teleporter.wordTeleporter', () => {
		const wt = new WordTeleporter();
		wt.run();
	});
	context.subscriptions.push(wordTeleporter);
}
