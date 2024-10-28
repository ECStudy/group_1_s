import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { CreateTreeItemParams, CreateTreeItemResult, ICreateTreeItemCmd } from '../types';

@command({
  identifier: 'create.treeitem',
  handler: createTreeItemHandler,
})
export class CreateTreeItemCmd
  extends CommandBase<CreateTreeItemParams, CreateTreeItemResult>
  implements ICreateTreeItemCmd {}

function createTreeItemHandler({ label, uri, command }: CreateTreeItemParams): CreateTreeItemResult {
  const treeItem = new TreeItem(label, TreeItemCollapsibleState.None);
  treeItem.resourceUri = uri;
  treeItem.command = command;

  return { done: true, treeItem };
}
