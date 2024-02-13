import * as vscode from 'vscode';
import { getSvgCodes, getSvgDataUri } from '../utils/svgGenerator';

export class WordTeleporterExtension {
    window = vscode.window;
    matchRegex = RegExp(/[a-zA-Z0-9]{2,}/, "g");
    maximumSizeOfMatches = 26 * 26;
    isModeOn = false;

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

    run() {
        const activeEditor = this.window.activeTextEditor;
        if (activeEditor) {
            this.isModeOn = true;
            var currentLine = activeEditor?.selection.active?.line;

            // decoration data
            var svgCodes = getSvgCodes();
            var svgDecorations: any[] = [];
            var positions: { [key: string]: any } = {};
            var decorationType = vscode.window.createTextEditorDecorationType({});

            // decorate current line
            this.decorateLine(currentLine, svgDecorations, positions, svgCodes);

            // start decorating lines around the current
            var minLines = 0;
            var maxLines = activeEditor.document.lineCount - 1;
            var aboveLineIndex = currentLine;
            var bellowLineIndex = currentLine;
            while (aboveLineIndex - 1 >= minLines || bellowLineIndex < maxLines) {
                // above lines
                if (svgDecorations.length !== this.maximumSizeOfMatches) {
                    if (aboveLineIndex - 1 >= minLines) {
                        aboveLineIndex -= 1;
                        this.decorateLine(aboveLineIndex, svgDecorations, positions, svgCodes);
                    }
                }
                else {
                    break;
                }

                // bottom lines
                if (svgDecorations.length !== this.maximumSizeOfMatches) {
                    if (bellowLineIndex < maxLines) {
                        bellowLineIndex += 1;
                        this.decorateLine(bellowLineIndex, svgDecorations, positions, svgCodes);
                    }
                }
                else {
                    break;
                }
            }

            // listen to the user input
            if (svgDecorations.length) {
                activeEditor.setDecorations(decorationType, svgDecorations);
                var character: string | null = null;
                const typingEventDisposable = vscode.commands.registerCommand('type', args => {

                    var text: string = args.text;
                    if (text.search(/[a-z]/i) === -1) {
                        return;
                    }

                    if (!character) {
                        character = text;
                        return;
                    }

                    var code = character + text;

                    if (code in positions) {
                        activeEditor.selection = new vscode.Selection(
                            positions[code][0],
                            positions[code][1],
                            positions[code][0],
                            positions[code][1],
                        );

                        const reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.Default;
                        activeEditor.revealRange(activeEditor.selection, reviewType);
                    }

                    activeEditor.setDecorations(decorationType, []);
                    typingEventDisposable.dispose();
                    this.isModeOn = false;
                });
            }
        }
    }
}