import * as vscode from 'vscode';

let out: vscode.OutputChannel;

function init() {
  if (!out) {
    out = vscode.window.createOutputChannel('HTML to Markdown');
    out.show();
  }
}

export function log(log: string) {
  init();
  const date = new Date();
  out.appendLine(`${date.toLocaleString()}: ${log}`);
}
