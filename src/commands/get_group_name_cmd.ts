import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { GetGroupNameParams, GetGroupNameResult, IGetGroupNameCmd } from '../types';
import { window } from 'vscode';
import { CONFIRM_OPTION } from '../enums';

@command({
  identifier: 'get.group.name',
  handler: getGroupNameHandler,
})
export class GetGroupNameCmd extends CommandBase<GetGroupNameParams, GetGroupNameResult> implements IGetGroupNameCmd {}

async function getGroupNameHandler(params: GetGroupNameParams): Promise<GetGroupNameResult> {
  const groupName = await window.showInputBox({ title: 'group name' });

  if (!groupName) {
    const result = await window.showErrorMessage('please input group name', CONFIRM_OPTION.Ok, CONFIRM_OPTION.Cancel);

    if (result === CONFIRM_OPTION.Ok) {
      return getGroupNameHandler(params);
    }

    return { done: false, name: '' };
  }

  return { done: true, name: groupName };
}
