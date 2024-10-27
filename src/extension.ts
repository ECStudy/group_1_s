import * as vscode from 'vscode';
import { getCmdHandler, setCmdHandler } from './global.ts';
import { CurrentTabsProvider } from './global.ts';
const fs = require('fs');

export function activate(context: vscode.ExtensionContext) {
  setCmdHandler(context);

  const cmdHandler = getCmdHandler(context);
  cmdHandler.forEach((command) => {
    command.register();
  });

  const currentTabsProvider = new CurrentTabsProvider(context);
  vscode.window.registerTreeDataProvider('current-tabs', currentTabsProvider);

  vscode.window.onDidChangeActiveTextEditor(() => {
    currentTabsProvider.refresh();
  });

  vscode.window.tabGroups.onDidChangeTabs(() => {
    currentTabsProvider.refresh();
  });
}

export function deactivate() {}
