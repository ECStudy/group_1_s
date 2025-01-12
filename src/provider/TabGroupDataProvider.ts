import * as vscode from 'vscode';
import { GroupQuickPickItem, ITreeItem, TabAttr, TabAttrWithGroupId } from '../types';
import { Group, Tab } from '../treeItem';
import { TabGroupStateManager } from '../state';

export class TabGroupDataProvider implements vscode.TreeDataProvider<ITreeItem> {
  private _context: vscode.ExtensionContext;
  private _state: TabGroupStateManager;
  // private _groups: ITreeItem[];
  // private _groupMapper: Map<string, Group>;

  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._state = new TabGroupStateManager(this._context, 'TabGroupDataProvider');
    // this._groups = [];
    // this._groupMapper = new Map();
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ITreeItem) {
    const group = this._state.getGroupMapper()[element.id];
    if (group) {
      if (group instanceof Group) {
        return group;
      }

      return this.createGroup(group);
    }

    const parentGroup = this._state.getGroupMapper()[element.parentId ?? ''];
    if (!parentGroup) {
      throw new Error('no parent');
    }

    const tab = parentGroup.getTab(element.id);
    if (tab) {
      if (tab instanceof Tab) {
        return tab;
      }

      return this.createTab({
        groupId: element.parentId ?? '',
        id: (tab as Tab).id,
        resourceUri: (tab as Tab).resourceUri,
        command: (tab as Tab).command,
      });
    }

    throw new Error('no tree item');
  }

  getChildren(element?: ITreeItem) {
    if (!element) {
      return this._state.getGroups();
    }

    const group = this._state.getGroupMapper()[element.id];
    if (!group) {
      throw new Error('no group');
    }

    return group.children;
  }

  createTab(params: TabAttrWithGroupId) {
    const group = this._state.getGroupMapper()[params.groupId];
    if (!group) {
      throw new Error('no group');
    }

    const tab = group.createTab(params);
    this._state.updateGroup(group);

    return tab;
  }

  getTab(groupId: string, tabId: string): Tab;
  getTab(groupId: string, predicate: (tab: Tab) => boolean): Tab;
  getTab(groupId: string, predicate: string | ((tab: Tab) => boolean)): Tab {
    const group = this._state.getGroupMapper()[groupId];
    if (!group) {
      throw new Error('no group');
    }

    return group.getTab(predicate as any);
  }

  deleteTab(groupId: string, tabId: string): void;
  deleteTab(groupId: string, predicate: (tab: Tab) => boolean): void;
  deleteTab(groupId: string, predicate: string | ((tab: Tab) => boolean)): void {
    const group = this._state.getGroupMapper()[groupId];
    if (!group) {
      throw new Error('no group');
    }

    group.deleteTab(predicate as any);
    if (group.children.length === 0) {
      this.deleteGroup(groupId);
    }

    this._state.updateGroup(group);
  }

  createGroup(params: {
    id: string;
    label: vscode.TreeItemLabel;
    command?: vscode.Command;
    children?: ITreeItem[];
    tabMapper?: Record<string, Tab>;
  }) {
    const group = new Group(params);

    // this._state.getGroupMapper().set(params.id, group);
    // this._state.getGroups().push({ id: params.id });
    this._state.addGroup(group);

    return group;
  }

  getGroup(id: string) {
    const group = this._state.getGroupMapper()[id];
    if (!group) {
      throw new Error('no group');
    }

    return group;
  }

  getGroups(ids?: string[]) {
    const groups: Group[] = [];

    if (ids) {
      ids.forEach((id) => {
        const group = this._state.getGroupMapper()[id];
        if (group) groups.push(group);
      });
    }

    if (!ids) {
      this._state.getGroups().forEach(({ id }) => {
        const group = this._state.getGroupMapper()[id];
        if (group) groups.push(group);
      });
    }

    return groups;
  }

  getGroupsAsQuickPickItem(ids?: string[]) {
    const groups: GroupQuickPickItem[] = [];

    if (ids) {
      ids.forEach((group_id) => {
        const group = this._state.getGroupMapper()[group_id];
        if (!group) return;

        groups.push({
          id: group_id,
          label: group.toString(),
        });
      });
    }

    if (!ids) {
      this._state.getGroups().forEach(({ id }) => {
        const group = this._state.getGroupMapper()[id];
        if (!group) return;

        groups.push({
          id,
          label: group.toString(),
        });
      });
    }

    return groups;
  }

  hasGroup(params: { label?: string } | { id?: string }) {
    if ('id' in params && params.id) {
      return !!this._state.getGroupMapper()[params.id];
    }

    if ('label' in params && params.label) {
      return !!this._state.getGroups().find(({ id }) => {
        return this._state.getGroupMapper()[id]?.toString() === params.label;
      });
    }

    return false;
  }

  updateGroup(params: {
    id: string;
    label?: vscode.TreeItemLabel;
    collapsibleState?: vscode.TreeItemCollapsibleState;
  }) {
    const group = this._state.getGroupMapper()[params.id];
    if (!group) return;

    if (params.label) {
      group.label = params.label;
    }

    if (params.collapsibleState) {
      group.collapsibleState = params.collapsibleState;
    }

    this._state.updateGroup(group);
  }

  pushChildren({ groupId, children }: { groupId: string; children: TabAttr[] }) {
    const group = this._state.getGroupMapper()[groupId];
    if (!group) {
      throw new Error('no group');
    }

    for (const child of children) {
      group.createTab(child);
    }

    this._state.updateGroup(group);
  }

  deleteGroup(groupId: string) {
    // delete this._state.getGroupMapper()[groupId];ß
    // const newGroups = this._state.getGroups().filter(({ id }) => id !== groupId);
    this._state.deleteGroup(groupId);
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
