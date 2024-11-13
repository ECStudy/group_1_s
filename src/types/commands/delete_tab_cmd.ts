import { ITreeItem } from '..';
import { CommandResult, ICommandBase } from '../ICommadBase';

export type DeleteTabParams = ITreeItem;
export interface DeleteTabResult extends CommandResult {
  //
}

export interface IDeleteTabCmd extends ICommandBase<DeleteTabParams, DeleteTabResult> {}
