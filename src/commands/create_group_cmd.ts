import * as vscode from 'vscode';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { CreateGroupParams, CreateGroupResult, ICreateGroupCmd } from '../types';
import { getCommandProvider, getTabGroupDataProvider } from '../provider';
import { generateUUID, getOpenFileCommand, isUri } from '../utils';

@command({
  identifier: 'create.group',
  handler: createGroupHandler,
})
export class CreateGroupCmd extends CommandBase<CreateGroupParams, CreateGroupResult> implements ICreateGroupCmd {}

async function createGroupHandler(params: CreateGroupParams): Promise<CreateGroupResult> {
  const getTabNameResult = await getTabName(params);
  if (!isUri(params)) {
    return { done: false };
  }

  if (!getTabNameResult.done) {
    return { done: false };
  }

  const getTabResult = createTab(getTabNameResult.name, params);
  if (!getTabNameResult.done) {
    return { done: false };
  }

  const getGroupNameResult = await getGroupName();
  if (!getGroupNameResult) {
    return { done: false };
  }

  const createGroupResult = createGroup(getGroupNameResult.name, [getTabResult.tab.id]);
  if (!createGroupResult.done) {
    return { done: false };
  }

  const tabGroupProvider = getTabGroupDataProvider();
  tabGroupProvider.refresh();

  return { done: true };
}

async function getTabName(params: CreateGroupParams) {
  const commandProvider = getCommandProvider();
  const groupNameCmd = commandProvider.getCommand('get.tab.name');

  return await groupNameCmd.executeAsync(params);
}

function createTab(tabName: string, uri: vscode.Uri) {
  const tabGroupProvider = getTabGroupDataProvider();
  const tab = tabGroupProvider.createTab({
    id: generateUUID(),
    label: { label: tabName },
    command: getOpenFileCommand({ uri }),
  });

  return { done: true, tab };
}

async function getGroupName() {
  const commandProvider = getCommandProvider();
  const groupNameCmd = commandProvider.getCommand('get.group.name');

  return await groupNameCmd.executeAsync();
}

function createGroup(groupName: string, children: string[]) {
  const tabGroupProvider = getTabGroupDataProvider();

  const group = tabGroupProvider.createGroup({
    id: generateUUID(),
    label: { label: groupName },
    children: children,
  });

  return { done: true, group };
}
