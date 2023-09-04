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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html2MarkdownPreviewer = void 0;
const vscode = __importStar(require("vscode"));
// @ts-ignore
const turndown_1 = __importDefault(require("turndown"));
const logger_1 = require("./logger");
class Html2MarkdownPreviewer {
    constructor(context) {
        this._context = context;
        this.turndown = new turndown_1.default();
        (0, logger_1.log)('Html2MarkdownPreviewer is created.');
    }
    async showPreviewer() {
        try {
            const textEditor = vscode.window.activeTextEditor;
            if (!textEditor) {
                vscode.window.showWarningMessage('There is no active editor');
            }
            else if (!textEditor.selection.isEmpty) {
                await textEditor.selections.forEach(sel => {
                    this.showInCurrentEditor(textEditor, sel);
                });
            }
            else {
                const currentText = textEditor.document.getText();
                const md = this.turndown.turndown(currentText);
                await this.showInNewEditor(md);
            }
        }
        catch (err) {
            console.error(err);
            const e = err;
            (0, logger_1.log)(`name: ${e.name} ||| message: ${e.message} ||| ${e.stack}`);
        }
    }
    async showInNewEditor(content) {
        const doc = await vscode.workspace.openTextDocument({ language: 'markdown', content });
        // navigate to the new text document containing the markdown content
        vscode.commands.executeCommand('vscode.open', doc.uri);
    }
    async showInCurrentEditor(textEditor, range) {
        const textHTML = textEditor.document.getText(range);
        const textMarkdown = this.turndown.turndown(textHTML);
        await textEditor.edit(e => {
            e.replace(range, textMarkdown);
        });
    }
}
exports.Html2MarkdownPreviewer = Html2MarkdownPreviewer;
//# sourceMappingURL=previewer.js.map