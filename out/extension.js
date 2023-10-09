"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode")); // VSCode Extensibility API
const previewer_1 = require("./previewer");
// USED FOR: Custom Status Bar Button: https://github.dev/microsoft/vscode-extension-samples/tree/main/statusbar-sample
function enableStatusBarItem(context) {
    let myStatusBarItem;
    // USED FOR: Custom Status Bar Button:
    function updateStatusBarItem() {
        const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
        if (n > 0) {
            myStatusBarItem.text = `$(megaphone) ${n} line(s) selected`;
            myStatusBarItem.show();
        }
        else {
            myStatusBarItem.hide();
        }
    }
    // USED FOR: Custom Status Bar Button:
    function getNumberOfSelectedLines(editor) {
        let lines = 0;
        if (editor) {
            lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
        }
        return lines;
    }
    // register a command that is invoked when the status bar
    // item is selected
    const myCommandId = 'sample.showSelectionCount';
    context.subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
        const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
        vscode.window.showInformationMessage(`Yeah, ${n} line(s) selected... Keep going!`);
    }));
    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = myCommandId;
    context.subscriptions.push(myStatusBarItem);
    // register some listener that make sure the status bar 
    // item always up-to-date
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
    // update status bar item once at start
    updateStatusBarItem();
}
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
    // HTML-to-MARKDOWN
    const previewer = new previewer_1.Html2MarkdownPreviewer(context);
    let disposableHTML2Markdown = vscode.commands.registerCommand('vscode-wdx-development-extension.html2markdown', () => {
        previewer.showPreviewer();
    });
    context.subscriptions.push(disposableHTML2Markdown);
    // USER FOR: Custom Status Bar Button:
    enableStatusBarItem(context);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map