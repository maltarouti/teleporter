import * as vscode from 'vscode';
import { Base } from './base';

export class WordTeleporterExtension extends Base {
    window = vscode.window;
    matchRegex = RegExp(/[a-zA-Z0-9]{2,}/, 'g');

    decorate(
        lineNumber: number,
        svgDecorations: object[],
        positions: { [key: string]: any } = {},
        svgCodes: string[]
    ): undefined {

        const line = this.window.activeTextEditor?.document.lineAt(lineNumber);
        let word;
        if (line) {
            while ((word = this.matchRegex.exec(line?.text)) !== null) {
                const wordLastIndex = word.index + word[0].length;
                const code = svgCodes[svgCodes.length - 1];
                svgCodes.pop();
                svgDecorations.push({
                    range: new vscode.Range(lineNumber, wordLastIndex, lineNumber, wordLastIndex),
                    renderOptions: {
                        after: {
                            contentText: code,
                            color: '#000000',
                            backgroundColor: '#FFFFFF',
                            fontWeight: 'bold',
                        },
                    },
                });
                positions[code] = [lineNumber, wordLastIndex];
            }
        }
        return;
    }
}