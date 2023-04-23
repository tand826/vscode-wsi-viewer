import { spawn, execSync, ChildProcess } from "child_process";
import * as vscode from "vscode";

export const getServer = (wsi: string, port: number): ChildProcess => {
  const wsiserver = spawn("wsiserver", [wsi, "--port", port.toString()]);

  wsiserver.stdout.on("data", (data: Buffer) => {
    console.log(`stdout: ${data}`);
  });

  wsiserver.stderr.on("data", (data: Buffer) => {
    console.log(`stderr: ${data}`);
  });

  wsiserver.on("error", async (error: Error) => {
    console.log(`error: ${error.message}`);
    const pwd = execSync("pwd").toString().trim();
    console.log(`you may need to run 'ln -s $(which wsiserver) ${pwd}/wsiserver'`);
    const selection = await vscode.window.showInformationMessage(
      "Failed to start wsiserver! Make sure wsiserver is also installed!",
      "Go to wsiserver page"
    );

    if (selection === "Go to wsiserver page") {
      vscode.env.openExternal(vscode.Uri.parse("https://github.com/tand826/wsiserver"));
    }
  });

  wsiserver.on("close", (code: number) => {
    console.log(`child process exited with code ${code}`);
  });
  return wsiserver;
};
