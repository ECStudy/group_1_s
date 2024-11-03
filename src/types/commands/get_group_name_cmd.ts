import { CommandResult, ICommandBase } from '../ICommadBase';

export type GetGroupNameParams = void;

export interface GetGroupNameResult extends CommandResult {
  name: string;
}

export interface IGetGroupNameCmd extends ICommandBase<GetGroupNameParams, GetGroupNameResult> {}
