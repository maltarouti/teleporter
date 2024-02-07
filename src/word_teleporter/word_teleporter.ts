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
        // find how many matches in the line
        // if the matches is less than 26 * 26
        // We will go back in liens till we reach (26 * 26) / 2
        // We will find the word at index (26 * 26) / 2 that is in back
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

        if (typeof firstWord !== 'undefined') {
            return this.activeEditor?.document.getWordRangeAtPosition(
                new vscode.Position(currentLine, firstWord));
        }
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
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" height="22" width="22">`;
        svg += `<rect width="22" height="22" rx="0" ry="0" style="fill: #ffffff;"></rect>`;
        svg += `<text font-family="arial" font-size="3px" textLength="3" textAdjust="spacing" fill="#000000" x="2.4" y="4" alignment-baseline="baseline">`;
        svg += code;
        svg += `</text></svg>`;
        return vscode.Uri.parse(`data:image/svg+xml;utf8,${svg}`);
    }

    drawSvgDataUris(word: vscode.Range) {
        var decorations = [];
        var codes = this.getSvgCodes();

        for (var count = 0; count < codes.length; count++) {
            var line = word.end.line;
            var character = word.end.character;

            var svgDataUri = this.getSvgDataUri(codes[count]);

            decorations.push({
                range: new vscode.Range(line, character, line, character + 2),
                renderOptions: {
                    after: {
                        contentIconPath: svgDataUri
                    },
                    backgroundColor: "#ff0000",
                },
            });
            break;
        }

        const decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                margin: `0 0 0 2px`,
                height: '22px',
                width: `22px`,
            }
        });
        vscode.window.activeTextEditor?.setDecorations(decorationType, decorations);
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
                    this.drawSvgDataUris(startingWord);
                }

                // 3. We will stop editing mode
                // var character: string | null = null;
                // const typingEventDisposable = vscode.commands.registerCommand('type', args => {

                //     vscode.commands.executeCommand('default:type', args);


                // 11. We will listen to the two character code from user
                // var text: string = args.text;
                // if (text.search(/[a-z]/i) === -1) {
                //     return;
                // }

                // if (!character) {
                //     character = text;
                //     return;
                // }


                // 12. We will move the mouse to the place
                // 13. We will remove all decorations

                //     typingEventDisposable.dispose();
                // });
            }
        }
    }
}