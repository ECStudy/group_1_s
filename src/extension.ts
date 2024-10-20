import * as vscode from 'vscode';
import { getCmdHandler, setCmdHandler } from './global.ts';

export function activate(context: vscode.ExtensionContext) {
  setCmdHandler(context);

  const cmdHandler = getCmdHandler(context);
  cmdHandler.forEach((command) => {
    command.register();
  });
}

export function deactivate() {}
