import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { CreateGroupParams, CreateGroupResult, ICreateGroupCmd, TabAttr } from '../types';
import { getCommandProvider, getTabGroupDataProvider } from '../provider';
import { generateUUID, getOpenFileCommand, isUri } from '../utils';

@command({
  identifier: 'create.group',
  handler: createGroupHandler,
})
export class CreateGroupCmd extends CommandBase<CreateGroupParams, CreateGroupResult> implements ICreateGroupCmd {}

async function createGroupHandler(params: CreateGroupParams): Promise<CreateGroupResult> {
  if (!isUri(params)) {
    return { done: false };
  }

  const commandProvider = getCommandProvider();

  const getTabNameCommand = commandProvider.getCommand('get.tab.name');
  const getTabNameResult = await getTabNameCommand.executeAsync(params);
  if (!getTabNameResult.done) {
    return { done: false };
  }

  const groupNameCommand = commandProvider.getCommand('get.group.name');
  const getGroupNameResult = await groupNameCommand.executeAsync();
  if (!getGroupNameResult) {
    return { done: false };
  }

  const tabGroupProvider = getTabGroupDataProvider();
  const group = tabGroupProvider.createGroup({
    id: generateUUID(),
    label: { label: getGroupNameResult.name },
  });

  const tab: TabAttr = {
    label: { label: getTabNameResult.name },
    uri: params,
    command: getOpenFileCommand({ uri: params }),
  };

  tabGroupProvider.pushChildren({
    groupId: group.id,
    children: [tab],
  });

  tabGroupProvider.refresh();

  return { done: true };
}
