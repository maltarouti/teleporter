import * as vscode from 'vscode';

export class WordTeleporterExtension {
    window = vscode.window;
    matchRegex = RegExp(/[a-zA-Z0-9]{2,}/, "g");
    maximumSizeOfMatches = 26 * 26;
    isModeOn = false;

    getSvgCodes() {
        var codes = [];
        for (var i = 0; i < 26; i++) {
            for (var j = 0; j < 26; j++) {
                var code = String.fromCharCode(97 + i) + String.fromCharCode(97 + j);
                codes.push(code);
            }
        }
        return codes;
    }

    getSvgDataUri(code: string): vscode.Uri {
        var fontSize = this.window.activeTextEditor?.options.tabSize as number;
        const configuration = vscode.workspace.getConfiguration('editor');
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" height="15px" width="15px">`;
        svg += `<rect width="15" height="15" rx="2" ry="2" style="fill: #ffffff;"></rect>`;
        svg += `<text font-family="arial" font-size="${fontSize * 2}px" textLength="${fontSize * 2}" textAdjust="spacing" fill="#000000" x="2" y="${fontSize * 2}" alignment-baseline="baseline">`;
        svg += `${code}</text></svg>`;
        return vscode.Uri.parse(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
    }

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
                            contentIconPath: this.getSvgDataUri(code)
                        },
                    },
                });
                positions[code] = [lineNumber, wordLastIndex];
            }
        }
    }

    run() {
        if (this.isModeOn) {
            return;
        }

        const activeEditor = this.window.activeTextEditor;
        if (activeEditor) {
            this.isModeOn = true;
            var currentLine = activeEditor?.selection.active?.line;
            var svgCodes = this.getSvgCodes();
            var svgDecorations: any[] = [];
            var positions: { [key: string]: any } = {};
            var decorationType = vscode.window.createTextEditorDecorationType({});

            // decorate current line
            this.decorateLine(currentLine, svgDecorations, positions, svgCodes);

            var aboveLineIndex = currentLine;
            var bellowLineIndex = currentLine;
            while (aboveLineIndex - 1 >= 0 || bellowLineIndex < activeEditor.document.lineCount - 1) {
                // above lines
                if (svgDecorations.length !== this.maximumSizeOfMatches) {
                    if (aboveLineIndex - 1 >= 0) {
                        aboveLineIndex -= 1;
                        this.decorateLine(aboveLineIndex, svgDecorations, positions, svgCodes);
                    }
                }
                else {
                    break;
                }

                // bottom lines
                if (svgDecorations.length !== this.maximumSizeOfMatches) {
                    if (bellowLineIndex < activeEditor.document.lineCount - 1) {
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

                    activeEditor.selection = new vscode.Selection(
                        positions[code][0],
                        positions[code][1],
                        positions[code][0],
                        positions[code][1],
                    );

                    const reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.Default;
                    activeEditor.revealRange(activeEditor.selection, reviewType);
                    activeEditor.setDecorations(decorationType, []);
                    typingEventDisposable.dispose();
                    this.isModeOn = false;
                });
            }
        }
    }
}