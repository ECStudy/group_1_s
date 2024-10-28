import { ExtensionContext } from 'vscode';
import { CMD_IDENTIFIER } from './index';

export interface CommandParams {
  context: ExtensionContext;
}
export interface CommandResult {
  done: boolean;
}

export interface ICommandBase<
  TParams extends CommandParams = CommandParams,
  TResult extends CommandResult = CommandResult
> {
  get cmdIdentifier(): CMD_IDENTIFIER;
  register(): void;
  executeAsync(params: Omit<TParams, 'context'>): Promise<TResult>;
  dispose(): void;
}
