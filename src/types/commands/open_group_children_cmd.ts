import { CommandResult, ICommandBase } from '../ICommadBase';
import { ITreeItem } from '..';

export type OpenGroupChildrenParams = ITreeItem;
export interface OpenGroupChildrenResult extends CommandResult {
  //
}

export interface IOpenGroupChildrenCmd extends ICommandBase<OpenGroupChildrenParams, OpenGroupChildrenResult> {}
