import * as vscode from 'vscode';

export class Group extends vscode.TreeItem {
  children: string[];
  id: string;

  constructor(id: string, label: vscode.TreeItemLabel, children: string[]) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);

    this.id = id;
    this.children = children;
  }
}
