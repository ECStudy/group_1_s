import * as vscode from 'vscode';

export class Tab extends vscode.TreeItem {
  id: string;
  resourceUri: vscode.Uri;
  contextValue: string;

  constructor(id: string, resourceUri: vscode.Uri) {
    super(resourceUri, vscode.TreeItemCollapsibleState.None);

    this.id = id;
    this.resourceUri = resourceUri;
    this.contextValue = 'defaultTab';
  }
}
