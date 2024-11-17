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
import { getCommandProvider, getTabGroupDataProvider } from '../provider';
import { generateUUID, getOpenFileCommand, isUri } from '../utils';

@command({
  identifier: 'update.group.children',
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

  const commandProvider = getCommandProvider();
  const getTabNameCommand = commandProvider.getCommand('get.tab.name');
  const getTabNameResult = await getTabNameCommand.executeAsync(params);
  if (!getTabNameResult.done) {
    return { done: false };
  }

  const targetTab: TabAttr = {
    id: generateUUID(),
    label: { label: getTabNameResult.name },
    uri: params,
    command: getOpenFileCommand({ uri: params }),
  };

  tabGroupProvider.pushChildren({
    groupId: picked_group.id,
    children: [targetTab],
  });

  tabGroupProvider.refresh();

  return { done: true };
}
