import { Command } from './Command';
import { CMD_NAME } from '../types';

export class CommandHandler {
  private _commands: Map<CMD_NAME, Command> = new Map();

  constructor(commands: Command[]) {
    commands.forEach((command) => {
      this._commands.set(command.cmdName, command);
    });
  }

  public getCommand(cmdName: CMD_NAME) {
    return this._commands.get(cmdName);
  }

  public execute(cmdName: CMD_NAME, params: any) {
    const cmd = this.getCommand(cmdName);
    cmd?.execute(params);
  }

  public forEach(callback: (command: Command) => void) {
    this._commands.forEach((command) => callback(command));
  }
}
