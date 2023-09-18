import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as net from "net";
import { isFreePort } from "find-free-ports";

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

    const ports: string | undefined = vscode.workspace.getConfiguration("wsiviewer").get("ports");
    if (!ports) {
      vscode.window.showErrorMessage("Cannot find ports settings.");
      return;
    }

    const port = await getPort(ports.split(",").map((port) => parseInt(port)));
    if (port === -1) {
      vscode.window.showErrorMessage("Cannot find free port.");
      return;
    }

    const wsiserver = getServer(filePath, port);
    if (!wsiserver) {
      vscode.window.showErrorMessage("Cannot find wsiserver!");
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "vscode-wsi-viewer",
      `${filename} - WSI Viewer (port=${port})`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const htmlFilePath = vscode.Uri.file(context.asAbsolutePath(path.join("view", "index.html")));
    let html = fs.readFileSync(htmlFilePath.fsPath, "utf8");

    const indexjs = vscode.Uri.file(context.asAbsolutePath(path.join("view", "index.js")));
    const nonce = getNonce();

    const url: string | undefined = vscode.workspace.getConfiguration("wsiviewer").get("url");
    if (url === undefined) {
      vscode.window.showErrorMessage("Cannot find url settings.");
      return;
    }

    const template: string | undefined = vscode.workspace.getConfiguration("wsiviewer").get("template");
    if (template === undefined) {
      vscode.window.showErrorMessage("Cannot find template settings.");
      return;
    }

    html = html
      .replace("${indexjs}", panel.webview.asWebviewUri(indexjs).toString())
      .replace("${nonce}", nonce)
      .replace("${nonce}", nonce)
      .replace("${port}", port.toString())
      .replace("${url}", url)
      .replace("${template}", template);

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

export function deactivate() {}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const getPort = async (ports: Array<number>) => {
  for (const port of ports) {
    console.log(`Check port ${port}`);
    if (await isFreePort(port)) {
      return port;
    }
  }
  return -1;
};

const localPortIsFree = async (port: number) => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.on("error", () => {
      resolve(false);
    });

    server.listen(port, () => {
      server.close();
      resolve(true);
    });
  });
};
