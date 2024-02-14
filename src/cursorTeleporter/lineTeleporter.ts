import * as vscode from 'vscode';
import { Base } from './base';


export class LineTeleporterExtension extends Base {
    window = vscode.window;
    maximumSizeOfMatches = 26 * 26;
    isModeOn = false;

    decorate(lineNumber: number,
        svgDecorations: object[],
        positions: { [key: string]: any } = {},
        svgCodes: string[]): undefined {

        var line = this.window.activeTextEditor?.document.lineAt(lineNumber);
        if (line) {
            var code = svgCodes[svgCodes.length - 1];
            svgCodes.pop();
            svgDecorations.push({
                range: new vscode.Range(lineNumber, 0, lineNumber, 0),
                renderOptions: {
                    after: {
                        contentText: code,
                        color: '#000000',
                        backgroundColor: '#FFFFFF',
                        fontWeight: 'bold',
                    },
                },
            });
            positions[code] = [lineNumber, 0];
        }
    }
}