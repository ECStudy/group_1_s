import * as vscode from 'vscode';
import { Group, Tab } from '../tree';
import { GroupQuickPickItem } from '../types';
import { command } from '../decorator';

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

  createTab({ id, label, command }: { id: string; label: vscode.TreeItemLabel; command?: vscode.Command }) {
    const tab = new Tab(id, label);
    tab.command = command;

    this._tabMapper.set(id, tab);

    return tab;
  }

  getGroups(ids?: string[]): Group[] {
    const groups: Group[] = [];

    (ids ?? this._groups).forEach((id) => {
      const group = this._groupMapper.get(id);
      if (group) groups.push(group);
    });

    return groups;
  }

  getGroupsAsQuickPickItem(ids?: string[]): GroupQuickPickItem[] {
    const groups: GroupQuickPickItem[] = [];
    (ids ?? this._groups).forEach((group_id) => {
      const group = this._groupMapper.get(group_id);
      if (!group) return;

      groups.push({
        id: group_id,
        label: group.toString(),
      });
    });

    return groups;
  }

  hasGroup(params: { label?: string } | { id?: string }) {
    if ('id' in params && params.id) {
      return this._groupMapper.has(params.id);
    }

    if ('label' in params && params.label) {
      return !!this._groups.find((group_id) => {
        return this._groupMapper.get(group_id)?.toString() === params.label;
      });
    }

    return false;
  }

  updateGroup(params: {
    id: string;
    label?: vscode.TreeItemLabel;
    children?: string[];
    collapsibleState?: vscode.TreeItemCollapsibleState;
  }) {
    const group = this._groupMapper.get(params.id);
    if (!group) return;

    if (params.label) {
      group.label = params.label;
    }

    if (params.children) {
      group.children = params.children;
    }

    if (params.collapsibleState) {
      group.collapsibleState = params.collapsibleState;
    }
  }

  updateGroupChildren(params: {
    id: string;
    children: { id: string; label: vscode.TreeItemLabel; command?: vscode.Command }[];
    updateType: 'all' | 'push' | 'modify';
  }) {
    const group = this._groupMapper.get(params.id);
    if (!group) return;

    switch (params.updateType) {
      case 'all': {
        const children = params.children.map((child) => {
          const tab = this.createTab(child);
          return tab.id;
        });

        group.children = children;
        break;
      }
      case 'push': {
        const children = params.children.map((child) => {
          const tab = this.createTab(child);
          return tab.id;
        });

        group.children.push(...children);
        break;
      }
      case 'modify': {
        params.children.forEach(({ id, label }) => {
          const child = this._tabMapper.get(id);
          if (!child) return;

          child.label = label;
        });
      }
    }
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
