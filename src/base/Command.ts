import { ExtensionContext, commands } from 'vscode';
import { Disposable } from 'vscode';
import { CMD_IDENTIFIER } from '../types';

export abstract class Command<TParams = any> implements Disposable {
  private _context: ExtensionContext;
  private _identifier: CMD_IDENTIFIER = undefined as any;

  constructor(context: ExtensionContext) {
    this._context = context;
  }

  get cmdIdentifier() {
    return this._identifier;
  }

  register() {
    const disposable = commands.registerCommand(this._identifier, this.handle);

    this._context.subscriptions.push(disposable);
  }

  execute(params: TParams) {
    commands.executeCommand(this._identifier, params);
  }

  abstract handle(args: TParams): void;

  dispose() {}
}
