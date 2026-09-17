import vscode from 'vscode';
import ollama from 'ollama';

const model = "llama3.1";
const userPrompt = "Summarize the following text and strictly display only the summary. No other text or comments. Here is the text to be summarized:";

export default function activateLLMExtension(context: vscode.ExtensionContext) {

  const cmd = vscode.commands.registerCommand(
    "llm-md.summarize",
    async () => {

      // https://github.com/microsoft/vscode-extension-samples/blob/main/progress-sample/src/extension.ts
      vscode.window.withProgress(
        {
          // location: vscode.ProgressLocation.Window,
          location: vscode.ProgressLocation.Notification,
          title: 'LLM Summarization'
        },
        async progress => {
          // Progress is shown while this function runs.
          // It can also return a promise which is then awaited
          progress.report({ message: 'Summarizing...' });

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
                model,
                messages: [{
                  role: 'user',
                  content: userPrompt + text
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

        }
      );

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