import { Command, TreeItem, Uri } from 'vscode';
import { CommandParams, CommandResult, ICommandBase } from '../ICommadBas';

export interface CreateTreeItemParams extends CommandParams {
  label: string;
  uri: Uri;
  command?: Command;
}

export interface CreateTreeItemResult extends CommandResult {
  treeItem: TreeItem;
}

export interface ICreateTreeItemCmd extends ICommandBase<CreateTreeItemParams, CreateTreeItemResult> {}
