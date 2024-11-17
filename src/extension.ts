import * as vscode from 'vscode';
import { getCommandProvider, setCommandProvider, getTabGroupDataProvider, setTabGroupDataProvider } from './provider';

const fs = require('fs');

export function activate(context: vscode.ExtensionContext) {
  setCommandProvider(context);
  const cmdHandler = getCommandProvider();
  cmdHandler.forEach((command) => {
    command.register();
  });

  setTabGroupDataProvider(context);
}

export function deactivate() {}
