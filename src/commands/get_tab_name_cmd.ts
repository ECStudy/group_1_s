import * as path from 'path';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { GetTabNameParams, GetTabNameResult, IGetTabNameCmd } from '../types';
import { isUri } from '../utils';

@command({
  identifier: 'internal.get.tab.name',
  handler: getTabNameHandler,
})
export class GetTabNameCmd extends CommandBase<GetTabNameParams, GetTabNameResult> implements IGetTabNameCmd {}

async function getTabNameHandler(params: GetTabNameParams): Promise<GetTabNameResult> {
  if (isUri(params)) {
    return { done: true, name: path.basename(params.fsPath) };
  }

  return { done: false, name: '' };
}
