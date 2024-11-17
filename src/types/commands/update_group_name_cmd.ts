import { CommandResult, ICommandBase } from '../ICommadBase';
import { ITreeItem } from '..';

export type UpdateGroupNameParams = ITreeItem;
export interface UpdateGroupNameResult extends CommandResult {
  //
}

export interface IUpdateGroupNameCmd extends ICommandBase<UpdateGroupNameParams, UpdateGroupNameResult> {}
