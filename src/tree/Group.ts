import * as vscode from 'vscode';
import { Tab } from './Tab';
import { IGroup } from '../types';

export class Group extends vscode.TreeItem implements IGroup {
  children: { id: string; parentId: string }[];
  id: string;
  label: vscode.TreeItemLabel;
  private _tabMapper: Map<string, Tab>;

  constructor(id: string, label: vscode.TreeItemLabel) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);

    this.id = id;
    this.children = [];
    this.label = label;
    this._tabMapper = new Map();
  }

  toString() {
    return this.label.label;
  }

  createTab(params: { label: vscode.TreeItemLabel; uri: vscode.Uri; command?: vscode.Command }) {
    const _tab = this._tabMapper.get(params.uri.path);
    if (_tab) {
      return _tab;
    }

    const tab = new Tab(params.uri.path, params.label, params.uri);
    tab.command = params.command;

    this.children.push({ id: params.uri.path, parentId: this.id });
    this._tabMapper.set(params.uri.path, tab);

    return tab;
  }

  getTab(predicate: string | ((tab: Tab) => boolean)) {
    if (typeof predicate === 'string') {
      const tab = this._tabMapper.get(predicate);
      if (!tab) {
        throw new Error('no tab');
      }

      return tab;
    }

    for (const { id } of this.children) {
      const tab = this._tabMapper.get(id);
      if (!tab) continue;

      if (predicate(tab)) {
        return tab;
      }
    }

    throw new Error('no tab');
  }
}
