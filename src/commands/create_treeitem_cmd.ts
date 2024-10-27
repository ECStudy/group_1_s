import { Command, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { command } from '../decorator';
import { CommandBase, TCommandParams, TCommandResult } from '../base';

@command({
  identifier: 'create.treeitem',
  handler: createTreeItemHandler,
})
export class CreateTreeItemCmd extends CommandBase<CreateTreeItemParams, CreateTreeItemResult> {}

export interface CreateTreeItemParams extends TCommandParams {
  label: string;
  uri: Uri;
  command?: Command;
}
export interface CreateTreeItemResult extends TCommandResult {
  treeItem: TreeItem;
}

function createTreeItemHandler({ label, uri, command }: CreateTreeItemParams): CreateTreeItemResult {
  const treeItem = new TreeItem(label, TreeItemCollapsibleState.None);
  treeItem.resourceUri = uri;
  treeItem.command = command;

  return { done: true, treeItem };
}
