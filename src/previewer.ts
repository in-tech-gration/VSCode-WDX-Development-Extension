import * as vscode from 'vscode';
import TurndownService from 'turndown';

import { log } from './logger';


export class Html2MarkdownPreviewer {

    private _context: vscode.ExtensionContext;
    private turndown: TurndownService;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
        this.turndown = new TurndownService();
        log('Html2MarkdownPreviewer is created.');
    }

    public async showPreviewer() {
        try {
            const textEditor = vscode.window.activeTextEditor;
            if (!textEditor) {
                vscode.window.showWarningMessage('There is no active editor');
            } else if (!textEditor.selection.isEmpty) {
                await textEditor.selections.forEach(sel => {
                    this.showInCurrentEditor(textEditor, sel);
                });
            } else {
                const currentText = textEditor.document.getText();
                const md = this.turndown.turndown(currentText);
                await this.showInNewEditor(md);
            }
        } catch (err) {
            console.error(err);
            const e = err as Error;
            log(`name: ${e.name} ||| message: ${e.message} ||| ${e.stack}`);
        }
    }

    private async showInNewEditor(content: string): Promise<void> {
        const doc = await vscode.workspace.openTextDocument({ language: 'markdown', content });
        // navigate to the new text document containing the markdown content
        vscode.commands.executeCommand('vscode.open', doc.uri);
    }
    
    private async showInCurrentEditor(
            textEditor: vscode.TextEditor,
            range: vscode.Range) {
        const textHTML = textEditor.document.getText(range);
        const textMarkdown = this.turndown.turndown(textHTML);
        await textEditor.edit(e => {
            e.replace(range, textMarkdown);
        });
    }
}
