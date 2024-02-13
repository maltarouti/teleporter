import * as vscode from 'vscode';

export function getSvgCodes() {
    var codes = [];
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 26; j++) {
            var code = String.fromCharCode(122 - i) + String.fromCharCode(122 - j);
            codes.push(code);
        }
    }
    return codes;
}

export function getSvgDataUri(code: string): vscode.Uri {
    var fontSize = 4;
    var svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" height="15px" width="15px">`;
    svg += `<rect width="15" height="15" rx="2" ry="2" style="fill: #ffffff;"></rect>`;
    svg += `<text font-family="arial" font-size="${fontSize * 2}px" textLength="${fontSize * 2}" textAdjust="spacing" fill="#000000" x="2" y="${fontSize * 2}" alignment-baseline="baseline">`;
    svg += `${code}</text></svg>`;
    return vscode.Uri.parse(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
}