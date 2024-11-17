import * as vscode from 'vscode';

export class Tab extends vscode.TreeItem {
  id: string;
  resourceUri: vscode.Uri;
  contextValue: string;

  constructor(params: { id: string; resourceUri: vscode.Uri; command?: vscode.Command }) {
    super(params.resourceUri, vscode.TreeItemCollapsibleState.None);

    this.id = params.id;
    this.resourceUri = params.resourceUri;
    this.contextValue = 'defaultTab';
    this.command = params.command;
  }
}
