import * as vscode from 'vscode';
import { Runner } from './runner';
import { getSvgDataUri } from '../utils/svgGenerator';

export class LineTeleporterExtension extends Runner {
    window = vscode.window;
    maximumSizeOfMatches = 26 * 26;
    isModeOn = false;

    decorateLine(lineNumber: number,
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
                        contentIconPath: getSvgDataUri(code)
                    },
                },
            });
            positions[code] = [lineNumber, 0];
        }
    }
}