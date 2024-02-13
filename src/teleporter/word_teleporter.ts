import * as vscode from 'vscode';
import { Runner } from './runner';
import { getSvgDataUri } from '../utils/svgGenerator';

export class WordTeleporterExtension extends Runner {
    window = vscode.window;
    matchRegex = RegExp(/[a-zA-Z0-9]{2,}/, "g");

    decorateLine(lineNumber: number,
        svgDecorations: object[],
        positions: { [key: string]: any } = {},
        svgCodes: string[]): undefined {

        var line = this.window.activeTextEditor?.document.lineAt(lineNumber);
        let word;
        if (line) {
            while ((word = this.matchRegex.exec(line?.text)) !== null) {
                var wordLastIndex = word.index + word[0].length;
                var code = svgCodes[svgCodes.length - 1];
                svgCodes.pop();
                svgDecorations.push({
                    range: new vscode.Range(lineNumber, wordLastIndex, lineNumber, wordLastIndex),
                    renderOptions: {
                        after: {
                            contentIconPath: getSvgDataUri(code)
                        },
                    },
                });
                positions[code] = [lineNumber, wordLastIndex];
            }
        }
    }
}