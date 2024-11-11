import * as vscode from 'vscode';

export interface TabAttr {
  label: vscode.TreeItemLabel;
  uri: vscode.Uri;
  command?: vscode.Command;
}

export interface TabAttrWithGroupId extends TabAttr {
  groupId: string;
}

export interface ITab extends vscode.TreeItem {
  //
}
