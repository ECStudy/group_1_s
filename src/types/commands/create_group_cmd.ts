import { CommandParams, CommandResult, ICommandBase } from '../ICommadBas';

export interface CreateGroupParams extends CommandParams {
  //
}

export interface CreateGroupResult extends CommandResult {
  //
}

export interface ICreateGroupCmd extends ICommandBase<CreateGroupParams, CreateGroupResult> {}
