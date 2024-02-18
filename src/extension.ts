import * as vscode from 'vscode';
import { WordTeleporterExtension as WordTeleporter } from './cursorTeleporter/wordTeleporter';
import { LineTeleporterExtension as LineTeleporter } from './cursorTeleporter/lineTeleporter';

export async function activate(context: vscode.ExtensionContext) {

	const wt = new WordTeleporter();
	const lt = new LineTeleporter();
	const teleporters = [wt, lt];

	async function start(teleporter: any) {
		for (var t of teleporters) {
			if (t.isModeOn) {
				return;
			}
		}
		teleporter.run();
	}


	async function stop() {
		for (var t of teleporters) {
			if (t.isModeOn) {
				t.dispose();
				return;
			}
		}
	}

	let wordTeleporter = vscode.commands.registerCommand('teleporter.wordTeleporter', () => { start(wt); });
	let lineTeleporter = vscode.commands.registerCommand('teleporter.lineTeleporter', () => { start(lt); });
	let cancelTeleporting = vscode.commands.registerCommand('teleporter.cancelTeleporting', stop);
	context.subscriptions.push(wordTeleporter, lineTeleporter, cancelTeleporting);
}
