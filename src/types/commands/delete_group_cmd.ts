import { ITreeItem } from '..';
import { CommandResult, ICommandBase } from '../ICommadBase';

export type DeleteGroupParams = ITreeItem;
export interface DeleteGroupResult extends CommandResult {
  //
}

export interface IDeleteGroupCmd extends ICommandBase<DeleteGroupParams, DeleteGroupResult> {}
