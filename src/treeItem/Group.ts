import * as vscode from 'vscode';
import { Tab } from './Tab';
import { ITreeItem } from '../types';

export class Group extends vscode.TreeItem {
  children: ITreeItem[];
  id: string;
  label: vscode.TreeItemLabel;
  contextValue: string;
  private _tabMapper: Map<string, Tab>;

  constructor(id: string, label: vscode.TreeItemLabel) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);

    this.id = id;
    this.children = [];
    this.label = label;
    this.contextValue = 'defaultGroup';
    this._tabMapper = new Map();
  }

  toString() {
    return this.label.label;
  }

  createTab(params: { id: string; label: vscode.TreeItemLabel; uri: vscode.Uri; command?: vscode.Command }) {
    const _tab = this._tabMapper.get(params.id);
    if (_tab) {
      return _tab;
    }

    const tab = new Tab(params.id, params.label, params.uri);
    tab.command = params.command;

    this.children.push({ id: params.id, parentId: this.id, uri: params.uri });
    this._tabMapper.set(params.id, tab);

    return tab;
  }

  getTab(id: string): Tab;
  getTab(predicate: (tab: Tab) => boolean): Tab;
  getTab(predicate: string | ((tab: Tab) => boolean)): Tab {
    if (typeof predicate === 'string') {
      return this._getTabById(predicate);
    }

    if (typeof predicate === 'function') {
      return this._getTabByCallback(predicate);
    }

    throw new Error('no tab');
  }

  private _getTabById(id: string) {
    const tab = this._tabMapper.get(id);
    if (!tab) {
      throw new Error('no tab');
    }

    return tab;
  }

  private _getTabByCallback(predicate: (tab: Tab) => boolean) {
    for (const { id } of this.children) {
      const tab = this._tabMapper.get(id);
      if (!tab) continue;

      if (predicate(tab)) {
        return tab;
      }
    }

    throw new Error('no tab');
  }

  deleteTab(id: string): void;
  deleteTab(predicate: (tab: Tab) => boolean): void;
  deleteTab(predicate: string | ((tab: Tab) => boolean)) {
    if (typeof predicate === 'string') {
      return this._deleteTabById(predicate);
    }

    if (typeof predicate === 'function') {
      return this._deleteTabByCallback(predicate);
    }
  }

  private _deleteTabById(id: string) {
    this._tabMapper.delete(id);
    this.children = this.children.filter((tab) => tab.id !== id);
  }

  private _deleteTabByCallback(predicate: (tab: Tab) => boolean) {
    for (const { id } of this.children) {
      const tab = this._tabMapper.get(id);
      if (!tab) continue;

      if (predicate(tab)) {
        this._deleteTabById(id);
      }
    }
  }
}
