import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as net from "net";

import { getServer } from "./wsiserver";

export function activate(context: vscode.ExtensionContext) {
  const openWSI = async (filePath: string) => {
    // https://openslide.org/#about-openslide
    const exts = ["svs", "tif", "vms", "vmu", "ndpi", "scn", "mrxs", "tiff", "svslide", "bif"];
    const platform = os.platform();
    const ext = filePath.split(".").pop()!;
    if (!exts.includes(ext)) {
      return;
    }

    let filename = "";
    if (platform === "win32") {
      filename = filePath.split("\\").pop()!;
    } else if (platform === "darwin" || platform === "linux") {
      filename = filePath.split("/").pop()!;
    }

    const port = await getPort(31791, 32000);

    const wsiserver = getServer(filePath, port);
    if (!wsiserver) {
      vscode.window.showErrorMessage("Cannot find wsiserver!");
      return false;
    }

    const panel = vscode.window.createWebviewPanel(
      "vscode-wsi-viewer",
      `${filename} - WSI Viewer (port=${port})`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const htmlFilePath = vscode.Uri.file(path.join(context.extensionPath, "src/view/index.html"));
    let html = fs.readFileSync(htmlFilePath.fsPath, "utf8");

    const indexjs = vscode.Uri.file(path.join(context.extensionPath, "src/view/index.js"));
    const nonce = getNonce();

    // html = html.replace("${indexjs}", ).replace("${nonce}", nonce);
    html = html
      .replace("${indexjs}", panel.webview.asWebviewUri(indexjs).toString())
      .replace("${nonce}", nonce)
      .replace("${nonce}", nonce)
      .replace("${port}", port.toString());

    panel.webview.html = html;

    panel.onDidDispose(() => {
      wsiserver.kill();
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.openWSI", (uri: vscode.Uri) => {
      const filePath = uri.fsPath;
      openWSI(filePath);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const getPort = async (start: number, end: number) => {
  for (let port = start; port < end; port++) {
    return await portIsUsed(port);
  }
  return -1; // return an error code if the port is not found
};

const portIsUsed = async (port: number): Promise<number> => {
  const server = net.createServer();

  server.on("listening", () => {
    const address = server.address() as net.AddressInfo;
    port = address.port;
    server.close();
  });

  return new Promise<number>((resolve, reject) => {
    server.on("close", () => {
      if (port) {
        resolve(port);
      } else {
        reject(new Error("Port not found"));
      }
    });
    server.on("error", (err) => reject(err));
    server.listen(0, "127.0.0.1");
  });
};
