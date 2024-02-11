import * as vscode from 'vscode';

export interface Decoration {
    bgColor: string;
    fgColor: string;

    fontFamily: string;
    fontSize: number;
}

export class WordTeleporterExtension {
    window = vscode.window;
    activeEditor = this.window.activeTextEditor;
    matchRegex = /[a-zA-Z0-9]{2,}/g;
    maximumSizeOfMatches = 26 * 26;

    getCurrentLine(): number | undefined {
        return this.activeEditor?.selection.active?.line;
    }

    getStartingword(currentLine: number): vscode.Range | undefined {
        var matchesCount = 0;
        var line = this.activeEditor?.document.lineAt(currentLine);

        // Find the line
        while (currentLine !== 0 && matchesCount < this.maximumSizeOfMatches / 2) {
            var words = line?.text.match(this.matchRegex);
            matchesCount += words ? words.length : 0;
            currentLine -= 1;
            line = this.activeEditor?.document.lineAt(currentLine);
        }

        // Find the character
        var wordIndex = matchesCount < this.maximumSizeOfMatches ?
            0 : matchesCount - this.maximumSizeOfMatches;

        // to be completed later
        var firstWord = line?.text.search(this.matchRegex);
        // to be completed later

        if (typeof firstWord !== 'undefined' && firstWord !== -1) {
            return this.activeEditor?.document.getWordRangeAtPosition(
                new vscode.Position(currentLine, firstWord));
        }
    }

    getNextRegexMatch(line: number, startPosition: number): vscode.Range | undefined {
        var document = this.activeEditor?.document;
        var lineCount = document?.lineCount;

        if (lineCount) {
            while (line < lineCount) {
                var text = document?.lineAt(line).text;
                if (text) {
                    var regex = new RegExp(this.matchRegex.source, "g");
                    regex.lastIndex = startPosition;
                    var match = regex.exec(text);
                    if (match) {
                        return new vscode.Range(
                            line,
                            match.index,
                            line,
                            match.index + match[0].length
                        );
                    }
                }
                line += 1;
                startPosition = 0;
            }
        }
        return undefined;
    }

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
        var fontSize = this.activeEditor?.options.tabSize as number;
        const configuration = vscode.workspace.getConfiguration('editor');
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" height="15px" width="15px">`;
        svg += `<rect width="15" height="15" rx="2" ry="2" style="fill: #ffffff;"></rect>`;
        svg += `<text font-family="arial"  font-size="${fontSize * 2}px" textLength="${fontSize * 2}" textAdjust="spacing" fill="#000000" x="2" y="${fontSize * 2}" alignment-baseline="baseline">`;
        svg += code;
        svg += `</text></svg>`;
        return vscode.Uri.parse(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
    }

    drawSvgDataUris(startingWord: vscode.Range | undefined): [vscode.TextEditorDecorationType, { [key: string]: any }] {
        var positions: { [key: string]: any } = {};
        var decorations = [];
        var codes = this.getSvgCodes();
        var count = 0;


        while (startingWord && count !== this.maximumSizeOfMatches) {
            var line = startingWord.end.line;
            var character = startingWord.end.character;
            var code = codes[count];
            var svgDataUri = this.getSvgDataUri(code);

            decorations.push({
                range: new vscode.Range(line, character, line, character),
                renderOptions: {
                    after: {
                        contentIconPath: svgDataUri
                    },
                },
            });

            positions[code] = [line, character];

            var nextMatch = this.getNextRegexMatch(line, character + 1);
            if (nextMatch) {
                startingWord = nextMatch;
            }
            else {
                startingWord = undefined;
            }
            count += 1;
        }
        const decorationType = vscode.window.createTextEditorDecorationType({});
        this.activeEditor?.setDecorations(decorationType, decorations);

        return [decorationType, positions];
    }

    undrawSvgDataUris(decorationType: vscode.TextEditorDecorationType): undefined {
        this.activeEditor?.setDecorations(decorationType, []);
    }

    run() {
        const activeEditor = this.window.activeTextEditor;

        if (activeEditor) {
            // 1. get the current line
            var currentLine = this.getCurrentLine();

            // 2. find starting word
            if (typeof currentLine !== 'undefined') {
                var startingWord = this.getStartingword(currentLine);

                // 3. draw
                if (startingWord) {
                    var result = this.drawSvgDataUris(startingWord);
                    var decorationType = result[0];
                    var positions = result[1];

                    // 3. We will stop editing mode
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

                        this.undrawSvgDataUris(decorationType);
                        typingEventDisposable.dispose();
                    });
                }
            }
        }
    }
}