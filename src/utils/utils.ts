import * as vscode from 'vscode'; // VSCode Extensibility API

// Prompt user for API key and store in SecretStorage
export async function promptForApiKey({ context, key, keyLabel }: { context: vscode.ExtensionContext, key: string, keyLabel: string }) {

  const apiKey = await vscode.window.showInputBox({
    prompt: `Enter your ${keyLabel} Key`,
    ignoreFocusOut: true,
    password: true,
  });
  if (!apiKey) {
    return null;
  };
  await context.secrets.store(key, apiKey);
  vscode.window.showInformationMessage(`${keyLabel} Key saved securely!`);
  return apiKey;
}