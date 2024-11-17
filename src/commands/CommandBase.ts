import { ExtensionContext, commands } from 'vscode';
import { Disposable } from 'vscode';
import { CMD_IDENTIFIER, CommandResult, ICommandBase } from '../types';
import { CMD_TYPE } from '../enums';

export abstract class CommandBase<TParams = any, TResult extends CommandResult = CommandResult>
  implements Disposable, ICommandBase<TParams, TResult>
{
  private _context: ExtensionContext;
  private _identifier: CMD_IDENTIFIER = undefined as any;
  private _handler: (params: TParams) => TResult = undefined as any;

  constructor(context: ExtensionContext) {
    this._context = context;
  }

  get cmdIdentifier() {
    return this._identifier;
  }

  register() {
    const [command_type] = this._identifier.split('.');
    if (command_type === CMD_TYPE.internal) {
      return;
    }

    const disposable = commands.registerCommand(this._identifier, this._handler);
    this._context.subscriptions.push(disposable);
  }

  async executeAsync(params: TParams): Promise<TResult> {
    const [command_type] = this._identifier.split('.');
    if (command_type === CMD_TYPE.internal) {
      return this._handler(params);
    }

    return commands.executeCommand<TResult>(this._identifier, params);
  }

  dispose() {}
}
