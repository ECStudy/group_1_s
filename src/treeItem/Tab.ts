import * as vscode from 'vscode';

export class Tab extends vscode.TreeItem {
  id: string;
  label: vscode.TreeItemLabel;
  uri: vscode.Uri;
  contextValue: string;

  constructor(id: string, label: vscode.TreeItemLabel, uri: vscode.Uri) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.id = id;
    this.label = label;
    this.uri = uri;
    this.contextValue = 'defaultTab';
  }

  toString() {
    return this.label.label;
  }
}
