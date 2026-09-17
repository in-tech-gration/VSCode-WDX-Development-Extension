import vscode from 'vscode';
import ollama from 'ollama';

export default function activateLLMExtension(context: vscode.ExtensionContext) {

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