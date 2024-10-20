import { ExtensionContext, commands } from 'vscode';
import { Disposable } from 'vscode';
import { CMD_NAME } from '../types';

export abstract class Command<TParams = any> implements Disposable {
  private _context: ExtensionContext;
  private _name: CMD_NAME = undefined as any;

  constructor(context: ExtensionContext) {
    this._context = context;
  }

  get cmdName() {
    return this._name;
  }

  register() {
    const disposable = commands.registerCommand(this._name, this.handle);

    this._context.subscriptions.push(disposable);
  }

  execute(params: TParams) {
    commands.executeCommand(this._name, params);
  }

  abstract handle(args: TParams): void;

  dispose() {}
}
