import * as vscode from 'vscode';
import { Group, Tab } from '../treeItem';
import { ITreeItem } from '../types';

type TGroupsState = ITreeItem[];
type TGroupMapperState = Record<string, Group>;

export class TabGroupStateManager {
  private _context: vscode.ExtensionContext;
  private _id: string;
  private _groupsStateId: string;
  private _groupMapperStateId: string;

  constructor(context: vscode.ExtensionContext, id: string) {
    this._context = context;
    this._id = id;
    this._groupsStateId = `${id}_groups`;
    this._groupMapperStateId = `${id}_groupMapper`;
  }

  private _updateGroupsState(groups: TGroupsState) {
    this._context.workspaceState.update(this._groupsStateId, groups);
  }

  private _updateGroupMapperState(groupMapper: TGroupMapperState) {
    this._context.workspaceState.update(this._groupMapperStateId, groupMapper);
  }

  getGroups() {
    return this._context.workspaceState.get<TGroupsState>(this._groupsStateId, []);
  }

  getGroupMapper() {
    return this._context.workspaceState.get<TGroupMapperState>(this._groupMapperStateId, {});
  }

  addGroup(group: Group) {
    const groups = this.getGroups();

    const hasGroup = groups.find(({ id }) => id === group.id);
    if (!hasGroup) {
      groups.push({ id: group.id });
      this._updateGroupsState(groups);
    }

    this.updateGroup(group);
  }

  updateGroup(group: Group) {
    const groupMapper = this.getGroupMapper();
    groupMapper[group.id] = group;
    this._updateGroupMapperState(groupMapper);
  }

  deleteGroup(groupId: string) {
    const groups = this.getGroups().filter((item) => item.id !== groupId);
    this._updateGroupsState(groups);

    const groupMapper = this.getGroupMapper();
    delete groupMapper[groupId];
    this._updateGroupMapperState(groupMapper);
  }

  //   addTab(groupId: string, tab: Tab) {
  //     const groupMapper = this.getGroupMapper();
  //     const group = groupMapper.get(groupId);
  //     group?.children.push({ id: tab.id });
  //   }
}
