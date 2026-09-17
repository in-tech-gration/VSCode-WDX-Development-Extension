import vscode from 'vscode';
import { Html2MarkdownPreviewer } from './previewer';

export default function activateHTML2MarkdownExtension(context: vscode.ExtensionContext) {

  const previewer = new Html2MarkdownPreviewer(context);

  let disposableHTML2Markdown = vscode.commands.registerCommand('vscode-wdx-development-extension.html2markdown', () => {
    previewer.showPreviewer();
  });

  context.subscriptions.push(disposableHTML2Markdown);

}