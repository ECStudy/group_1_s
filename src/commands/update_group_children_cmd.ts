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
import { generateUUID, getOpenFileCommand, isTextEditor, isUri } from '../utils';
import { randomUUID } from 'crypto';

@command({
  identifier: 'extension.update.group.children',
  handler: updateGroupChildrenHandler,
})
export class UpdateGroupChildrenCmd
  extends CommandBase<UpdateGroupChildrenParams, UpdateGroupChildrenResult>
  implements IUpdateGroupChildrenCmd {}

async function updateGroupChildrenHandler(params: UpdateGroupChildrenParams): Promise<UpdateGroupChildrenResult> {
  if (params === undefined) {
    params = vscode.window.activeTextEditor?.document.uri;
  }

  if (isTextEditor(params)) {
    params = params.document.uri;
  }

  if (!isUri(params)) {
    return { done: false };
  }

  const tabGroupProvider = getTabGroupDataProvider();
  const groups = tabGroupProvider.getGroupsAsQuickPickItem();

  const idOfCreateNew = randomUUID();
  const createNewQuickPickItem: GroupQuickPickItem = {
    id: idOfCreateNew,
    label: '새 그룹',
  };
  groups.unshift(createNewQuickPickItem);

  const picked_group = await vscode.window.showQuickPick<GroupQuickPickItem>(groups);
  if (!picked_group) {
    return { done: false };
  }

  if (picked_group.id === idOfCreateNew) {
    const commandProvider = getCommandProvider();
    const createGroupCommand = commandProvider.getCommand('internal.create.group');
    const result = await createGroupCommand.executeAsync(params);

    return result;
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
