import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { UpdateGroupNameParams, UpdateGroupNameResult, IUpdateGroupNameCmd } from '../types';
import { getCommandProvider, getTabGroupDataProvider } from '../provider';

@command({
  identifier: 'update.group.name',
  handler: updateGroupNameHandler,
  register: true,
})
export class UpdateGroupNameCmd
  extends CommandBase<UpdateGroupNameParams, UpdateGroupNameResult>
  implements IUpdateGroupNameCmd {}

async function updateGroupNameHandler(params: UpdateGroupNameParams): Promise<UpdateGroupNameResult> {
  const commandProvider = getCommandProvider();
  const getGroupNameCommand = commandProvider.getCommand('get.group.name');
  const getGroupNameResult = await getGroupNameCommand.executeAsync();
  if (!getGroupNameResult.done) {
    return { done: false };
  }

  const tabGroupDataProvider = getTabGroupDataProvider();
  tabGroupDataProvider.updateGroup({ id: params.id, label: { label: getGroupNameResult.name } });
  tabGroupDataProvider.refresh();

  return { done: true };
}
