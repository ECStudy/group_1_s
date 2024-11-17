import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { DeleteGroupParams, DeleteGroupResult, IDeleteGroupCmd } from '../types';
import { getTabGroupDataProvider } from '../provider';

@command({
  identifier: 'delete.group',
  handler: deleteGroupHandler,
})
export class DeleteGroupCmd extends CommandBase<DeleteGroupParams, DeleteGroupResult> implements IDeleteGroupCmd {}

async function deleteGroupHandler(params: DeleteGroupParams): Promise<DeleteGroupResult> {
  const tabGroupProvier = getTabGroupDataProvider();
  tabGroupProvier.deleteGroup(params.id);
  tabGroupProvier.refresh();

  return { done: true };
}
