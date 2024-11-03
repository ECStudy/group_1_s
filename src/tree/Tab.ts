import * as vscode from 'vscode';

export class Tab extends vscode.TreeItem {
  id: string;

  constructor(id: string, label: vscode.TreeItemLabel) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.id = id;
  }
}
