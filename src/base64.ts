// Based on: https://github.com/adamhartford/vscode-base64
import * as vscode from 'vscode';
import Window = vscode.window;
import Range = vscode.Range;
import Selection = vscode.Selection;
import TextDocument = vscode.TextDocument;
import TextEditor = vscode.TextEditor;

// TODO: Decode to Hex -> Buffer.from(word, 'base64').toString('hex')
// TODO: Encode from Hex -> word = word.padStart(word.length % 2 === 0 ? word.length : word.length + 1, '0') -> Buffer.from(word, 'hex').toString('base64');

function base64Encode(e: TextEditor, d: TextDocument, sel: Selection[]) {
  e.edit(function (edit) {
    sel.forEach(function (s) {
      let txt: string = d.getText(new Range(s.start, s.end));
      // let b: Buffer = new Buffer(txt); // DEPRECATED
      let b: Buffer = Buffer.from(txt);
      // Alternative: btoa(text);
      edit.replace(s, b.toString('base64'));
    });
  });
}

function base64Decode(e: TextEditor, d: TextDocument, sel: Selection[]) {
  e.edit(function (edit) {
    sel.forEach(function (s) {
      let txt: string = d.getText(new Range(s.start, s.end));
      // let b: Buffer = new Buffer(txt, 'base64'); // DEPRECATED
      let b: Buffer = Buffer.from(txt, 'base64');
      // Alternative: atob(text);
      edit.replace(s, b.toString());
    });
  });
}

export default function activateBase64Extension(context: vscode.ExtensionContext) {

  let encode = vscode.commands.registerCommand('vscode-wdx-development-extension.base64Encode', () => {
    let e = Window.activeTextEditor;
    if (!e){
      return;
    }
    let d = e.document;
    let sel = e.selections;
    // @ts-ignore
    base64Encode(e, d, sel);
  });

  let decode = vscode.commands.registerCommand('vscode-wdx-development-extension.base64Decode', () => {
    let e = Window.activeTextEditor;
    if (!e){
      return;
    }
    let d = e.document;
    let sel = e.selections;
    // @ts-ignore
    base64Decode(e, d, sel);
  });

  context.subscriptions.push(encode);
  context.subscriptions.push(decode);

}

