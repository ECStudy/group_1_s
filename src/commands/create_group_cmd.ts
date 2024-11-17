import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { CreateGroupParams, CreateGroupResult, ICreateGroupCmd, TabAttr } from '../types';
import { getCommandProvider, getTabGroupDataProvider } from '../provider';
import { generateUUID, getOpenFileCommand, isUri } from '../utils';

@command({
  identifier: 'extension.create.group',
  handler: createGroupHandler,
})
export class CreateGroupCmd extends CommandBase<CreateGroupParams, CreateGroupResult> implements ICreateGroupCmd {}

async function createGroupHandler(params: CreateGroupParams): Promise<CreateGroupResult> {
  if (!isUri(params)) {
    return { done: false };
  }

  const commandProvider = getCommandProvider();
  const groupNameCommand = commandProvider.getCommand('internal.get.group.name');
  const getGroupNameResult = await groupNameCommand.executeAsync();
  if (!getGroupNameResult.done) {
    return { done: false };
  }

  const tabGroupProvider = getTabGroupDataProvider();
  const groupId = generateUUID();
  const group = tabGroupProvider.createGroup({
    id: groupId,
    label: { label: getGroupNameResult.name },
    command: { title: '탭 토글', command: 'extension.open.group.children', arguments: [{ id: groupId }] },
  });

  const tab: TabAttr = {
    id: generateUUID(),
    resourceUri: params,
    command: getOpenFileCommand({ uri: params }),
  };

  tabGroupProvider.pushChildren({
    groupId: group.id,
    children: [tab],
  });

  tabGroupProvider.refresh();

  return { done: true };
}
