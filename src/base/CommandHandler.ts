import { CommandBase } from './Command';
import { CMD_IDENTIFIER } from '../types';

export class CommandHandler {
  private _commands: Map<CMD_IDENTIFIER, CommandBase> = new Map();

  constructor(commands: CommandBase[]) {
    commands.forEach((command) => {
      this._commands.set(command.cmdIdentifier, command);
    });
  }

  public getCommand(cmdIdentifier: CMD_IDENTIFIER) {
    return this._commands.get(cmdIdentifier);
  }

  public getCommands(cmdIdentifiers: CMD_IDENTIFIER[]) {
    return cmdIdentifiers.map((identifier) => {
      return this._commands.get(identifier);
    });
  }

  public forEach(callback: (command: CommandBase) => void) {
    this._commands.forEach((command) => callback(command));
  }
}
