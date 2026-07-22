import * as vscode from 'vscode'; // VSCode Extensibility API
import * as deepl from 'deepl-node';

// >> DeepL << Load cached usage from SecretStorage
async function updateStatusBarFromCache(context: vscode.ExtensionContext) {
  const cached = await context.secrets.get('deeplLastUsage');
  if (cached) {
    try {
      const usage = JSON.parse(cached);
      const chars = usage.character ? `${usage.character.count}/${usage.character.limit}` : '-';
      const docs = usage.document ? `${usage.document.count}/${usage.document.limit}` : '-';
      statusBarItem.text = `DeepL: ${chars} chars | ${docs} docs`;
    } catch {
      statusBarItem.text = 'DeepL: -';
    }
  } else {
    statusBarItem.text = 'DeepL: -';
  }
}

// >> DeepL << Format usage nicely
function formatUsageText(usage: any) {
  const chars = usage.character ? `${usage.character.count}/${usage.character.limit}` : '-';
  return `$(symbol-string) DeepL: ${chars} chars`;
  // const docs = usage.document ? `${usage.document.count}/${usage.document.limit}` : '-';
  // return `DeepL: ${chars} chars | ${docs} docs`;
}

// >> DeepL << Prompt user for API key and store in SecretStorage
async function promptForDeepLApiKey(context: vscode.ExtensionContext, force = false) {
  const apiKey = await vscode.window.showInputBox({
    prompt: 'Enter your DeepL API Key',
    ignoreFocusOut: true,
    password: true,
  });
  if (!apiKey) {
    return null;
  };
  await context.secrets.store('deeplApiKey', apiKey);
  vscode.window.showInformationMessage('DeepL API Key saved securely!');
  return apiKey;
}

// >> DeepL << Update usage from API and cache it
async function updateDeepLUsageStatus(client: deepl.DeepLClient, context: vscode.ExtensionContext) {
  try {
    const usage = await client.getUsage();
    const usageText = formatUsageText(usage);
    statusBarItem.text = usageText;

    // Cache last usage in SecretStorage
    await context.secrets.store('deeplLastUsage', JSON.stringify({
      character: usage.character,
      document: usage.document
    }));
  } catch (err) {
    statusBarItem.text = 'DeepL: ❌';
    console.error('Failed to fetch DeepL usage:', err);
  }
}

let statusBarItem: vscode.StatusBarItem;

export function registerDeepLCommand(context: vscode.ExtensionContext) {

  // Create Status Bar Item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.color = new vscode.ThemeColor('charts.blue'); // light blue
  statusBarItem.tooltip = 'DeepL API usage';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Load cached usage from secret storage
  updateStatusBarFromCache(context);

  async function translateFromTo({ from, to }: { from: deepl.SourceLanguageCode, to: deepl.TargetLanguageCode }) {

    // vscode.window.showInformationMessage(`Translating from ${from} to ${to}`);

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    };

    const selections = editor.selections;

    // Retrieve API key from SecretStorage
    const apiKey = await context.secrets.get('deeplApiKey') || await promptForDeepLApiKey(context);

    if (!apiKey) {
      return;
    };

    const authKey = apiKey;
    const deeplClient = new deepl.DeepLClient(authKey);

    const results = await Promise.all(
      selections.map(async sel => {
        const text = editor.document.getText(sel);
        const result = await deeplClient.translateText(text, from, to);
        return { sel, processed: result.text };
      })
    );

    editor.edit(editBuilder => {
      for (const r of results) {
        editBuilder.replace(r.sel, r.processed);
      }
    });

    // Update status after translation
    await updateDeepLUsageStatus(deeplClient, context);

  }

  // >> DeepL: en->el <<
  const deepL = vscode.commands.registerCommand(
    "deepl-md.translate",
    async () => await translateFromTo({ from: "en", to: "el" })
  );

  context.subscriptions.push(deepL);

  // >> DeepL: el->en <<
  const deepL_el2en = vscode.commands.registerCommand(
    "deepl-md.translate-el2en",
    async () => await translateFromTo({ from: "el", to: "en-US" })
  );

  context.subscriptions.push(deepL_el2en);

  // >> DeepL: de->en <<
  const deepL_de2en = vscode.commands.registerCommand(
    "deepl-md.translate-de2en",
    async () => await translateFromTo({ from: "de", to: "en-US" })
  );

  context.subscriptions.push(deepL_de2en);

  // >> DeepL: en->de <<
  const deepL_en2de = vscode.commands.registerCommand(
    "deepl-md.translate-en2de",
    async () => await translateFromTo({ from: "en", to: "de" })
  );

  context.subscriptions.push(deepL_en2de);

}