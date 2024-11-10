import * as vscode from 'vscode';

export class Group extends vscode.TreeItem {
  children: string[];
  id: string;
  label: vscode.TreeItemLabel;

  constructor(id: string, label: vscode.TreeItemLabel, children: string[]) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);

    this.id = id;
    this.children = children;
    this.label = label;
  }

  toString() {
    return this.label.label;
  }
}
