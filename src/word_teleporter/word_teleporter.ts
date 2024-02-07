import * as vscode from 'vscode';


export class WordTeleporterExtension {
    window = vscode.window;
    activeEditor = this.window.activeTextEditor;
    document = this.activeEditor?.document;

    getCurrentPosition(): { line: Number | undefined, character: Number | undefined } {
        const currentPosition = this.activeEditor?.selection.active;
        var line = currentPosition?.line;
        var character = currentPosition?.character;
        return {
            line: line,
            character: character
        };
    }

    run() {
        this.window.showInformationMessage("hello world");

        var text = this.document?.getText();
        this.window.showInformationMessage(`${text}`);



    }
}