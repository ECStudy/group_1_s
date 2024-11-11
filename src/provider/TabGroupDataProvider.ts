import * as vscode from 'vscode';
import { Group, Tab } from '../tree';
import { GroupQuickPickItem, ITabGroupProvider, TabAttr, TabAttrWithGroupId } from '../types';

export class TabGroupDataProvider implements ITabGroupProvider {
  private _context: vscode.ExtensionContext;
  private _groups: { id: string; parentId?: string }[];
  private _groupMapper: Map<string, Group>;

  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._groups = [];
    this._groupMapper = new Map();
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: { id: string; parentId?: string }) {
    const group = this._groupMapper.get(element.id);
    if (group) {
      return group;
    }

    const parentGroup = this._groupMapper.get(element.parentId ?? '');
    if (!parentGroup) {
      throw new Error('no parent');
    }

    const tab = parentGroup.getTab(element.id);
    if (tab) {
      return tab;
    }

    throw new Error('no tree item');
  }

  getChildren(element?: { id: string; parentId?: string }) {
    if (!element) {
      return this._groups;
    }

    const group = this._groupMapper.get(element.id);

    if (!group) {
      throw new Error('no group');
    }

    return group.children;
  }

  createTab(params: TabAttrWithGroupId) {
    const group = this._groupMapper.get(params.groupId);
    if (!group) {
      throw new Error('no group');
    }

    return group.createTab(params);
  }

  getTab(groupId: string, predicate: string | ((tab: Tab) => boolean)) {
    const group = this._groupMapper.get(groupId);
    if (!group) {
      throw new Error('no group');
    }

    return group.getTab(predicate);
  }

  createGroup({ id, label }: { id: string; label: vscode.TreeItemLabel }) {
    const group = new Group(id, label);

    this._groupMapper.set(id, group);
    this._groups.push({ id });

    return group;
  }

  getGroups(ids?: string[]) {
    const groups: Group[] = [];

    if (ids) {
      ids.forEach((id) => {
        const group = this._groupMapper.get(id);
        if (group) groups.push(group);
      });
    }

    if (!ids) {
      this._groups.forEach(({ id }) => {
        const group = this._groupMapper.get(id);
        if (group) groups.push(group);
      });
    }

    return groups;
  }

  getGroupsAsQuickPickItem(ids?: string[]) {
    const groups: GroupQuickPickItem[] = [];

    if (ids) {
      ids.forEach((group_id) => {
        const group = this._groupMapper.get(group_id);
        if (!group) return;

        groups.push({
          id: group_id,
          label: group.toString(),
        });
      });
    }

    if (!ids) {
      this._groups.forEach(({ id }) => {
        const group = this._groupMapper.get(id);
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
      return this._groupMapper.has(params.id);
    }

    if ('label' in params && params.label) {
      return !!this._groups.find(({ id }) => {
        return this._groupMapper.get(id)?.toString() === params.label;
      });
    }

    return false;
  }

  updateGroup(params: {
    id: string;
    label?: vscode.TreeItemLabel;
    collapsibleState?: vscode.TreeItemCollapsibleState;
  }) {
    const group = this._groupMapper.get(params.id);
    if (!group) return;

    if (params.label) {
      group.label = params.label;
    }

    if (params.collapsibleState) {
      group.collapsibleState = params.collapsibleState;
    }
  }

  pushChildren({ groupId, children }: { groupId: string; children: TabAttr[] }) {
    const group = this._groupMapper.get(groupId);
    if (!group) {
      throw new Error('no group');
    }

    for (const child of children) {
      group.createTab(child);
    }
  }
}

let tabGroupDataProvider: ITabGroupProvider;
export const setTabGroupDataProvider = (context: vscode.ExtensionContext) => {
  tabGroupDataProvider = new TabGroupDataProvider(context);
  vscode.window.registerTreeDataProvider('tabgroup', tabGroupDataProvider);
};

export const getTabGroupDataProvider = () => {
  return tabGroupDataProvider;
};