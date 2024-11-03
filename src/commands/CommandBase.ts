import { ExtensionContext, commands } from 'vscode';
import { Disposable } from 'vscode';
import { CMD_IDENTIFIER, CommandResult, ICommandBase } from '../types';

export abstract class CommandBase<TParams = any, TResult extends CommandResult = CommandResult>
  implements Disposable, ICommandBase<TParams, TResult>
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

  async executeAsync(params: TParams): Promise<TResult> {
    return commands.executeCommand<TResult>(this._identifier, params);
  }

  dispose() {}
}
