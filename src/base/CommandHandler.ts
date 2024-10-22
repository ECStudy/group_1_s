import { Command } from './Command';
import { CMD_IDENTIFIER } from '../types';

export class CommandHandler {
  private _commands: Map<CMD_IDENTIFIER, Command> = new Map();

  constructor(commands: Command[]) {
    commands.forEach((command) => {
      this._commands.set(command.cmdIdentifier, command);
    });
  }

  public getCommand(cmdName: CMD_IDENTIFIER) {
    return this._commands.get(cmdName);
  }

  public execute(cmdName: CMD_IDENTIFIER, params: any) {
    const cmd = this.getCommand(cmdName);
    cmd?.execute(params);
  }

  public forEach(callback: (command: Command) => void) {
    this._commands.forEach((command) => callback(command));
  }
}
