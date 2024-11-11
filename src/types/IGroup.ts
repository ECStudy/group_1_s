import * as vscode from 'vscode';
import { Tab } from '../tree';

export interface IGroup extends vscode.TreeItem {
  createTab(params: { label: vscode.TreeItemLabel; uri: vscode.Uri; command?: vscode.Command }): Tab;
  getTab(tabId: string): Tab;
  getTab(predicate: (tab: Tab) => boolean): Tab;
}
