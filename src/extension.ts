import * as vscode from 'vscode'; // VSCode Extensibility API
import { registerDeepLCommand } from './deepl';
import registerYouTubeCommand from "./youtube";
import activateHTML2MarkdownExtension from "./html2markdown";
import activateBase64Extension from "./base64";
import activateLLMExtension from "./llm";
// import { activate as activateHighlightExtension } from './extensions/vscode-highlight/';

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

  // DeepL
  registerDeepLCommand(context);

  // YouTube
  registerYouTubeCommand(context);

  // VSCode Highlight Extension: https://github.com/fabiospampinato/vscode-highlight
  // activateHighlightExtension(context);

  // MARKDOWN-to-HTML (Work in progress...)
  
  // HTML-to-MARKDOWN
  activateHTML2MarkdownExtension(context);

  // BASE64 ENCODING/DECODING
  activateBase64Extension(context);

  // USER FOR: Custom Status Bar Button:
  // enableStatusBarItem(context);

  // LLM:
  activateLLMExtension(context);

}


// This method is called when your extension is deactivated
export function deactivate() { }
