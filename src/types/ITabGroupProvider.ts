import * as vscode from 'vscode';
import { Group, Tab } from '../tree';
import { GroupQuickPickItem, TabAttr, TabAttrWithGroupId } from '.';

export interface ITabGroupProvider extends vscode.TreeDataProvider<{ id: string; parentId?: string }> {
  refresh(): void;

  createTab(params: TabAttrWithGroupId): Tab;
  getTab(groupId: string, tabId: string): Tab;
  getTab(groupId: string, predicate: (tab: Tab) => boolean): Tab;

  createGroup({ id, label }: { id: string; label: vscode.TreeItemLabel }): Group;
  getGroups(ids?: string[]): Group[];
  getGroupsAsQuickPickItem(ids?: string[]): GroupQuickPickItem[];
  hasGroup(params: { label?: string } | { id?: string }): boolean;
  updateGroup(params: {
    id: string;
    label?: vscode.TreeItemLabel;
    collapsibleState?: vscode.TreeItemCollapsibleState;
  }): void;
  pushChildren(params: { groupId: string; children: TabAttr[] }): void;
}
