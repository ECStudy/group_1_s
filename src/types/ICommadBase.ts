import { CMD_IDENTIFIER } from './index';

export interface CommandResult {
  done: boolean;
}

export interface ICommandBase<TParams = any, TResult extends CommandResult = CommandResult> {
  get cmdIdentifier(): CMD_IDENTIFIER;
  register(): void;
  executeAsync(params: TParams): Promise<TResult>;
  dispose(): void;
}
