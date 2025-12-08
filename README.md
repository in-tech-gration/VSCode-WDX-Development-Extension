# WDX Development Pack

**Work in progress...**

## Features

- HTML to Markdown conversion _(forked from the [vscode-html-to-markdown](https://github.com/Wtango/vscode-html-to-markdown) extension by [Tango Wu](https://github.com/Wtango))_

## Available Commands

- `WDX:HTML to Markdown`: convert current opened editor HTML code snippet to Markdown and open in a new tab. If HTML code snippets are selected in the current editor, the HTML is converted to Markdown without opening a new tab.

Press `F1` or `Ctrl + Shift + p` or `Cmd + Shift + p`(macOS) to open command palette, input `HTML to Markdown`, then execute it.

- `DeepL:Translate (en->el)`: Translate selected text from English to Greek.

- `LLM:Summarize`: Summarize text using Ollama (llama3.1).

## Extension Settings

## Development

  Pack: `vsce package`

  Install: `code --install-extension vscode-wdx-development-extension-0.1.1.vsix`

## Release Notes

### 0.1.4 (08/12/2025)

Added DeepL translation of selected text

### 0.1.3 (08/12/2025)

Added LLM summarization of selected text via Ollama

### 0.1.2 (08/12/2025)

Added boilerplate for simple text selection manipulation (toUppercase)

### 0.1.1

Added (experimental) Status Bar button

### 0.1.0

Initial release