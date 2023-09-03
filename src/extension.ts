import * as vscode from 'vscode'; // VSCode Extensibility API

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-wdx-development-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// https://code.visualstudio.com/api/get-started/your-first-extension
	let disposable = vscode.commands.registerCommand('vscode-wdx-development-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from VSCode-WDX-Development-Extension!');
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

}

// This method is called when your extension is deactivated
export function deactivate() { }
