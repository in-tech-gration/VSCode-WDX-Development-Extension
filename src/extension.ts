import * as vscode from 'vscode'; // VSCode Extensibility API

import { Html2MarkdownPreviewer } from './previewer';
import ollama from 'ollama';

// USED FOR: Custom Status Bar Button: https://github.dev/microsoft/vscode-extension-samples/tree/main/statusbar-sample
function enableStatusBarItem(context: vscode.ExtensionContext) {

  let myStatusBarItem: vscode.StatusBarItem;

  // USED FOR: Custom Status Bar Button:
  function updateStatusBarItem(): void {
    const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
    if (n > 0) {
      myStatusBarItem.text = `$(megaphone) ${n} line(s) selected`;
      myStatusBarItem.show();
    } else {
      myStatusBarItem.hide();
    }
  }

  // USED FOR: Custom Status Bar Button:
  function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
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
export function activate(context: vscode.ExtensionContext) {

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

  // "The only purpose to add the entries to context.subscriptions is to guarantee their disposal during extension deactivation" ~ Rainbow CSV
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

  // MARKDOWN-to-HTML (Work in progress...)

  // HTML-to-MARKDOWN
  const previewer = new Html2MarkdownPreviewer(context);

  let disposableHTML2Markdown = vscode.commands.registerCommand('vscode-wdx-development-extension.html2markdown', () => {
    previewer.showPreviewer();
  });

  context.subscriptions.push(disposableHTML2Markdown);

  // USER FOR: Custom Status Bar Button:
  // enableStatusBarItem(context);
  const cmd = vscode.commands.registerCommand(
    "llm-md.summarize",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      };

      // Async:
      const selections = editor.selections;

      const results = await Promise.all(
        selections.map(async sel => {
          const text = editor.document.getText(sel);
          // const processed = await asyncProcess(text);
          // https://github.com/ollama/ollama-js
          const response = await ollama.chat({
            model: 'llama3.1',
            messages: [{
              role: 'user',
              content: 'Summarize the following text and strictly display only the summary. No other text or comments. Here is the text to be summarized: ' + text
            }],
          });
          return { sel, processed: response.message.content };
        })
      );

      editor.edit(editBuilder => {
        for (const r of results) {
          editBuilder.replace(r.sel, r.processed);
        }
      });

      // Sync:
      // editor.edit(editBuilder => {
      //   for (const sel of editor.selections) {
      //     const text = editor.document.getText(sel);
      //     editBuilder.replace(sel, text.toUpperCase());
      //   }
      // });
    }
  );

  context.subscriptions.push(cmd);

}

// This method is called when your extension is deactivated
export function deactivate() { }
