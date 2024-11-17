import * as vscode from 'vscode';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { DeleteGroupParams, DeleteGroupResult, IDeleteGroupCmd } from '../types';
import { getTabGroupDataProvider } from '../provider';
import { CONFIRM_OPTION } from '../enums';

@command({
  identifier: 'extension.delete.group',
  handler: deleteGroupHandler,
})
export class DeleteGroupCmd extends CommandBase<DeleteGroupParams, DeleteGroupResult> implements IDeleteGroupCmd {}

async function deleteGroupHandler(params: DeleteGroupParams): Promise<DeleteGroupResult> {
  const tabGroupProvier = getTabGroupDataProvider();

  const group = tabGroupProvier.getGroup(params.id);
  const confirmResult = await vscode.window.showInformationMessage<{ id: CONFIRM_OPTION; title: string }>(
    `'${group.toString()}'을 정말 삭제하시겠습니까?`,
    { id: CONFIRM_OPTION.Ok, title: '예' },
    { id: CONFIRM_OPTION.Cancel, title: '아니오' }
  );

  if (confirmResult?.id !== CONFIRM_OPTION.Ok) {
    return { done: false };
  }

  tabGroupProvier.deleteGroup(params.id);
  tabGroupProvier.refresh();

  return { done: true };
}
