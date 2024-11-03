import * as vscode from 'vscode';
import { Group, Tab } from '../tree';

export class TabGroupDataProvider implements vscode.TreeDataProvider<string> {
  private _context: vscode.ExtensionContext;
  private _groups: string[];

  private _groupMapper: Map<string, Group>;
  private _tabMapper: Map<string, Tab>;

  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._groups = [];
    this._groupMapper = new Map();
    this._tabMapper = new Map();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: string): vscode.TreeItem {
    const group = this._groupMapper.get(element);
    if (group) {
      return group;
    }

    const tab = this._tabMapper.get(element);
    if (tab) {
      return tab;
    }

    throw new Error('no tree item');
  }

  getChildren(id?: string): vscode.ProviderResult<string[]> {
    if (!id) {
      return this._groups;
    }

    const group = this._groupMapper.get(id);

    if (!group) {
      throw new Error('no group');
    }

    return group.children;
  }

  createGroup({ id, label, children }: { id: string; label: vscode.TreeItemLabel; children: string[] }) {
    const group = new Group(id, label, children);

    this._groupMapper.set(id, group);
    this._groups.push(id);

    return group;
  }

  createTab({ id, label }: { id: string; label: vscode.TreeItemLabel }) {
    const tab = new Tab(id, label);

    this._tabMapper.set(id, tab);

    return tab;
  }
}

let tabGroupDataProvider: TabGroupDataProvider;
export const setTabGroupDataProvider = (context: vscode.ExtensionContext) => {
  tabGroupDataProvider = new TabGroupDataProvider(context);
  vscode.window.registerTreeDataProvider('tabgroup', tabGroupDataProvider);
};

export const getTabGroupDataProvider = () => {
  return tabGroupDataProvider;
};
