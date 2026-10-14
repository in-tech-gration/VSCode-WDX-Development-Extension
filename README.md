# WDX Development Pack

**Work in progress...**

## Features

- HTML to Markdown conversion _(forked from the [vscode-html-to-markdown](https://github.com/Wtango/vscode-html-to-markdown) extension by [Tango Wu](https://github.com/Wtango))_

## Available Commands

- `WDX:HTML to Markdown`: convert current opened editor HTML code snippet to Markdown and open in a new tab. If HTML code snippets are selected in the current editor, the HTML is converted to Markdown without opening a new tab.

Press `F1` or `Ctrl + Shift + p` or `Cmd + Shift + p`(macOS) to open command palette, input `HTML to Markdown`, then execute it.

- `DeepL:Translate (en->el)`: Translate selected text from English to Greek.
- `DeepL:Translate (el->en)`: Translate selected text from Greek to English.
- `DeepL:Translate (de->en)`: Translate selected text from German to English.
- `DeepL:Translate (en->de)`: Translate selected text from English to German.

- `LLM:Summarize`: Summarize text using Ollama (llama3.1).

- `WDX:Base64 Encode`: Encode selected text using Base64.
- `WDX:Base64 Decode`: Decode selected Base64 text.

- `WDX:Get YouTube Information from URL or ID`. Select YouTube URL or Video ID and get video details and information, for example: select `https://www.youtube.com/watch?v=OaRq816CNhE` or `OaRq816CNhE`, open `VSCode Command Palette` and select `WDX:Get YouTube Information from URL or ID`. The following information is provided for the video:
  > 

  **The Social Model and Mike Oliver** _(Title)_
  **Duration**: 00:58:05
  **Channel**: Stark
  **Published at**: 10/02/2022

## Extension Settings

## Development

  Pack: `vsce package`

  Install: `code --install-extension vscode-wdx-development-extension-0.1.1.vsix`

## Release Notes

Check: [CHANGELOG](./CHANGELOG.md)

---

## Todo and Feature Requests

  - Follow and implement the [Extension Bundling Guide](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)