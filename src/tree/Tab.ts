import * as vscode from 'vscode';
import { ITab } from '../types';

export class Tab extends vscode.TreeItem implements ITab {
  id: string;
  label: vscode.TreeItemLabel;
  uri: vscode.Uri;

  constructor(id: string, label: vscode.TreeItemLabel, uri: vscode.Uri) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.id = id;
    this.label = label;
    this.uri = uri;
  }

  toString() {
    return this.label.label;
  }
}
