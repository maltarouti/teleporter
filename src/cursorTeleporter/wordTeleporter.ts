import * as vscode from 'vscode';
import { CursorTeleporterBase } from './base';


export class WordTeleporterExtension extends CursorTeleporterBase {
    window = vscode.window;

    async decorate(
        lineNumber: number,
        svgDecorations: object[],
        positions: { [key: string]: any } = {},
        svgCodes: Promise<string>[]
    ): Promise<undefined> {
        const config = vscode.workspace.getConfiguration('teleporter');
        const regex = config.get('wordMatchRegex', /[a-zA-Z0-9]{2,}/);
        const matchRegex = RegExp(regex, 'g');
        const line = this.window.activeTextEditor?.document.lineAt(lineNumber);
        let word;
        if (line) {
            while ((word = matchRegex.exec(line?.text)) !== null) {
                const wordLastIndex = word.index + word[0].length;
                const code = await svgCodes[svgCodes.length - 1];
                svgCodes.pop();
                svgDecorations.push({
                    range: new vscode.Range(lineNumber, wordLastIndex, lineNumber, wordLastIndex),
                    renderOptions: {
                        after: {
                            contentText: code,
                            color: config.get("hintColor"),
                            backgroundColor: config.get("hintBackgroundColor"),
                            fontWeight: config.get("hintFontweight"),
                            borderStyle: config.get("hintBorderStyle"),
                            borderColor: config.get("hintBorderColor"),
                            borderRadius: config.get("hintBorderRadius"),
                            fontStyle: config.get("hintFontStyle"),
                            opacity: config.get("hintOpacity")
                        },
                    },
                });
                positions[code] = [lineNumber, wordLastIndex];
            }
        }
        return;
    }
}