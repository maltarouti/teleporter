import * as vscode from 'vscode';
import { CursorTeleporterBase } from './base';


export class LineTeleporterExtension extends CursorTeleporterBase {
    window = vscode.window;

    async decorate(lineNumber: number,
        svgDecorations: object[],
        positions: { [key: string]: any } = {},
        svgCodes: Promise<string>[]): Promise<undefined> {
        const config = vscode.workspace.getConfiguration('teleporter');
        var line = this.window.activeTextEditor?.document.lineAt(lineNumber);
        if (line) {
            var code = await svgCodes[svgCodes.length - 1];
            svgCodes.pop();
            svgDecorations.push({
                range: new vscode.Range(lineNumber, 0, lineNumber, 0),
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
            positions[code] = [lineNumber, 0];
        }
    }
}