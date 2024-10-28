import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { CreateGroupParams, CreateGroupResult, ICreateGroupCmd } from '../types';
import { window } from 'vscode';

@command({
  identifier: 'create.group',
  handler: createTreeItemHandler,
})
export class CreateGroupCmd extends CommandBase<CreateGroupParams, CreateGroupResult> implements ICreateGroupCmd {}

function createTreeItemHandler({}: CreateGroupParams): CreateGroupResult {
  window.showInformationMessage('create group');

  return { done: true };
}
