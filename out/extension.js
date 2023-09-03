"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode"); // VSCode Extensibility API
// TODO: https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample 
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "vscode-wdx-development-extension" is now active!');
    // https://code.visualstudio.com/api/get-started/your-first-extension
    const disposable = vscode.commands.registerCommand('vscode-wdx-development-extension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from VSCode-WDX-Development-Extension!');
        // https://stackoverflow.com/a/53919833/4861760
        if (vscode.workspace.workspaceFolders !== undefined) {
            let wf = vscode.workspace.workspaceFolders[0].uri.path;
            let f = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const message = `YOUR-EXTENSION: folder: ${wf} - ${f}`;
            vscode.window.showInformationMessage(message);
            if (vscode.window.activeTextEditor) {
                const currentOpenFile = vscode.window.activeTextEditor.document.fileName;
                vscode.window.showInformationMessage(currentOpenFile);
            }
        }
        else {
            const message = "YOUR-EXTENSION: Working folder not found, open a folder an try again";
            vscode.window.showErrorMessage(message);
        }
    });
    context.subscriptions.push(disposable);
    // https://github.com/microsoft/vscode-extension-samples/tree/main/document-editing-sample
    const reverseWordDisposable = vscode.commands.registerCommand('vscode-wdx-development-extension.reverseWord', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            // Get the word within the selection
            const word = document.getText(selection);
            const reversed = word.split('').reverse().join('');
            editor.edit(editBuilder => {
                editBuilder.replace(selection, reversed);
            });
        }
    });
    context.subscriptions.push(reverseWordDisposable);
    // https://github.com/mennan/vscode-contextmenu-sample/tree/master
    const disposableContext = vscode.commands.registerCommand('vscode-wdx-development-extension.contextMenu', function () {
        vscode.window.showInformationMessage('Hello World from Context!');
    });
    context.subscriptions.push(disposableContext);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map