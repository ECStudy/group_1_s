import * as path from 'path';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { CreateGroupParams, CreateGroupResult, ICreateGroupCmd } from '../types';
import { getCommandProvider, getTabGroupDataProvider } from '../provider';
import { generateUUID, isUri } from '../utils';

@command({
  identifier: 'create.group',
  handler: createTreeItemHandler,
})
export class CreateGroupCmd extends CommandBase<CreateGroupParams, CreateGroupResult> implements ICreateGroupCmd {}

async function createTreeItemHandler(params: CreateGroupParams): Promise<CreateGroupResult> {
  const getTabNameResult = getTabName(params);
  if (!getTabNameResult.done) {
    return { done: false };
  }

  const getTabResult = createTab(getTabNameResult.tabName);
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

function getTabName(params: CreateGroupParams) {
  if (isUri(params)) {
    return { done: true, tabName: path.basename(params.fsPath) };
  }

  return { done: false, tabName: '' };
}

function createTab(tabName: string) {
  const tabGroupProvider = getTabGroupDataProvider();
  const tab = tabGroupProvider.createTab({
    id: generateUUID(),
    label: { label: tabName },
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
