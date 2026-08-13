import * as vscode from 'vscode'; // VSCode Extensibility API
import { promptForApiKey } from './utils/utils';
import https from "node:https";

const API_KEY_NAME = "youtubeApiKey";

/**
 * @param {string}
 * @return {Array}
 * The captured groups are:
  - protocol
  - subdomain
  - domain
  - path
  - video code
  - query string
 */
const ytRegex = (text: string) => {

  const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
  const match = text.match(regex);

  let playlist = null;

  // TODO: Playlist?
  // if (match[6] === "playlist") {
  //   if (match[7].indexOf("?list=") === 0) {
  //     playlist = match[7].split("?list=")[1];
  //   }
  // }

  if (match) {
    return {
      url: match[0],
      protocol: match[1],
      subdomain: match[2],
      domain: match[3],
      playlist: playlist ? playlist : undefined,
      path: match[5],
      vid: match[6]
    };
  }

  return null;

}

function formatDate(iso8601String: string) {
  const parsedDate = new Date(iso8601String);
  const day = parsedDate.getUTCDate().toString().padStart(2, "0");
  const month = (parsedDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = parsedDate.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

function ytDurationToHHMMSS(duration: string) {

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return duration; // Return a default value if the format is invalid
  }

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  // Format the output as HH:MM:SS
  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

const youTubeIdRegEx = /([a-z0-9_-]{11})/i;

export default function registerYouTubeCommand(context: vscode.ExtensionContext) {

  const reverseWordDisposable = vscode.commands.registerCommand('vscode-wdx-development-extension.youtube', async function () {

    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    };

    // Retrieve API key from SecretStorage
    const apiKey = await context.secrets.get(API_KEY_NAME) || await promptForApiKey({
      context,
      key: API_KEY_NAME,
      keyLabel: "YouTube API"
    });

    if (!apiKey) {
      return;
    };

    const document = editor.document;
    const selection = editor.selection;

    // Get the word within the selection
    let youTube = document.getText(selection);
    let youTubeId = youTube;

    if (youTubeId.startsWith("https://")) {
      const vidObj = ytRegex(youTube);
      if (vidObj === null) {
        return;
      }
      youTubeId = vidObj.vid;
    }

    if (!youTubeIdRegEx.test(youTube)) {
      vscode.window.showErrorMessage(`Invalid YouTube ID: ${youTubeId}`);
      return console.log(`Invalid YouTube ID: ${youTubeId}`);
    }

    const URL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2C+snippet&id=${youTubeId}&key=${apiKey}`

    try {

      let data = "";

      https.get(URL, function (response) {

        // response.statusCode, response.headers
        response
          .on("data", append => {
            data += append
          })
          .on("error", e => {
            console.log(e);
            vscode.window.showErrorMessage(e.toString());
          })
          .on("end", () => {

            const json = JSON.parse(data);

            if (json.error) {
              return console.log(json.error.message);
            }

            const videoInfo = json.items[0];

            const ytTitle = videoInfo.snippet.title;
            const ytDuration = videoInfo.contentDetails.duration;
            const ytChannelTitle = videoInfo.snippet.channelTitle;
            const ytPublishedAt = videoInfo.snippet.publishedAt;
            const ytId = videoInfo.id;
            const ytTags = videoInfo.snippet.tags;
            // const defaultAudioLanguage = videoInfo.snippet.defaultAudioLanguage.split("-")[0];
            const ytDescription = videoInfo.snippet.description;
            // videoInfo.contentDetails.caption // BOOLEAN
            // const thumbnail_url = videoInfo.snippet.thumbnails.standard ? videoInfo.snippet.thumbnails.standard.url : videoInfo.snippet.thumbnails.high.url;

            if (!videoInfo) {
              console.log("Ops! Something went wrong.");
              return vscode.window.showErrorMessage("Ops! Something went wrong.");
            }

            // Write to Clipboard: output
            // console.log("Content copied to clipboard. Just use Ctrl+V to paste.", output);

            editor.edit(editBuilder => {
              editBuilder.replace(
                selection, `${youTube}\n${ytTitle}\nDuration: ${ytDurationToHHMMSS(ytDuration)}\nChannel: ${ytChannelTitle}\nPublished at: ${formatDate(ytPublishedAt)}`);
            });

          });

      }).on("error", e => {

        console.log(e);
        vscode.window.showErrorMessage(e.toString());

      });

    } catch (error) {

      console.log("Ops!", { error });

    }

  });

  context.subscriptions.push(reverseWordDisposable);

}