import * as vscode from 'vscode';


export class Base {
    window = vscode.window;
    maximumSizeOfMatches = 26 * 26;
    isModeOn = false;

    decorate(lineNumber: number,
        svgDecorations: object[],
        positions: { [key: string]: any } = {},
        svgCodes: string[]): undefined { }

    getSvgCodes() {
        var codes = [];
        for (var i = 0; i < 26; i++) {
            for (var j = 0; j < 26; j++) {
                var code = String.fromCharCode(122 - i) + String.fromCharCode(122 - j);
                codes.push(code);
            }
        }
        return codes;
    }


    run() {
        const activeEditor = this.window.activeTextEditor;
        if (activeEditor) {
            this.isModeOn = true;
            var currentLine = activeEditor?.selection.active?.line;

            // decoration data
            var svgCodes = this.getSvgCodes();
            var svgDecorations: any[] = [];
            var positions: { [key: string]: any } = {};
            var decorationType = vscode.window.createTextEditorDecorationType({});

            // decorate current line
            this.decorate(currentLine, svgDecorations, positions, svgCodes);

            // start decorating lines around the current
            var minLines = 0;
            var maxLines = activeEditor.document.lineCount - 1;
            var aboveLineIndex = currentLine;
            var bellowLineIndex = currentLine;
            while (aboveLineIndex - 1 >= minLines || bellowLineIndex < maxLines) {
                // above lines
                if (svgDecorations.length <= this.maximumSizeOfMatches) {
                    if (aboveLineIndex - 1 >= minLines) {
                        aboveLineIndex -= 1;
                        this.decorate(aboveLineIndex, svgDecorations, positions, svgCodes);
                    }
                }
                else {
                    break;
                }

                // bottom lines
                if (svgDecorations.length <= this.maximumSizeOfMatches) {
                    if (bellowLineIndex < maxLines) {
                        bellowLineIndex += 1;
                        this.decorate(bellowLineIndex, svgDecorations, positions, svgCodes);
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