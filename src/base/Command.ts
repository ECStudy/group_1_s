import { ExtensionContext, commands } from 'vscode';
import { Disposable } from 'vscode';
import { CMD_IDENTIFIER } from '../types';

type TCommandParams = Object;
type TCommandResult = { done: boolean };
export abstract class Command<
  TParams extends TCommandParams = TCommandParams,
  TResut extends TCommandResult = TCommandResult
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

  async executeAsync(params: TParams): Promise<TResut> {
    return await commands.executeCommand<TResut>(this._identifier, params);
  }

  dispose() {}
}
