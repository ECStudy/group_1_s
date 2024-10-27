import { ExtensionContext, commands } from 'vscode';
import { Disposable } from 'vscode';
import { CMD_IDENTIFIER } from '../types';

export interface TCommandParams {
  context: ExtensionContext;
}
export interface TCommandResult {
  done: boolean;
}
export abstract class CommandBase<
  TParams extends TCommandParams = TCommandParams,
  TResult extends TCommandResult = TCommandResult
> implements Disposable
{
  private _context: ExtensionContext;
  private _identifier: CMD_IDENTIFIER = undefined as any;
  private _handler: () => void = undefined as any;

  constructor(context: ExtensionContext) {
    this._context = context;
  }

  get cmdIdentifier() {
    return this._identifier;
  }

  register() {
    const disposable = commands.registerCommand(this._identifier, this._handler);

    this._context.subscriptions.push(disposable);
  }

  async executeAsync<TExecuteParams extends TParams = TParams, TExecuteResult extends TResult = TResult>(
    params: Omit<TExecuteParams, 'context'>
  ): Promise<TExecuteResult> {
    return commands.executeCommand<TExecuteResult>(this._identifier, params);
  }

  dispose() {}
}
