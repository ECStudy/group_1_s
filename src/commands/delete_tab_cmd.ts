import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { DeleteTabParams, DeleteTabResult, IDeleteTabCmd } from '../types';
import { getTabGroupDataProvider } from '../provider';

@command({
  identifier: 'extension.delete.tab',
  handler: deleteTabHandler,
})
export class DeleteTabCmd extends CommandBase<DeleteTabParams, DeleteTabResult> implements IDeleteTabCmd {}

async function deleteTabHandler(params: DeleteTabParams): Promise<DeleteTabResult> {
  const tabGroupProvier = getTabGroupDataProvider();

  if (!params.parentId) {
    return { done: false };
  }

  tabGroupProvier.deleteTab(params.parentId, params.id);
  tabGroupProvier.refresh();

  return { done: true };
}
