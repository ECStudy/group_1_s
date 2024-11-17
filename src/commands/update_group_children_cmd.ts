import * as vscode from 'vscode';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import {
  UpdateGroupChildrenParams,
  UpdateGroupChildrenResult,
  IUpdateGroupChildrenCmd,
  TabAttr,
  GroupQuickPickItem,
} from '../types';
import { getTabGroupDataProvider } from '../provider';
import { generateUUID, getOpenFileCommand, isUri } from '../utils';

@command({
  identifier: 'extension.update.group.children',
  handler: updateGroupChildrenHandler,
})
export class UpdateGroupChildrenCmd
  extends CommandBase<UpdateGroupChildrenParams, UpdateGroupChildrenResult>
  implements IUpdateGroupChildrenCmd {}

async function updateGroupChildrenHandler(params: UpdateGroupChildrenParams): Promise<UpdateGroupChildrenResult> {
  if (!isUri(params)) {
    return { done: false };
  }

  const tabGroupProvider = getTabGroupDataProvider();
  const groups = tabGroupProvider.getGroupsAsQuickPickItem();

  const picked_group = await vscode.window.showQuickPick<GroupQuickPickItem>(groups);
  if (!picked_group) {
    return { done: false };
  }

  const targetTab: TabAttr = {
    id: generateUUID(),
    resourceUri: params,
    command: getOpenFileCommand({ uri: params }),
  };

  tabGroupProvider.pushChildren({
    groupId: picked_group.id,
    children: [targetTab],
  });

  tabGroupProvider.refresh();

  return { done: true };
}
