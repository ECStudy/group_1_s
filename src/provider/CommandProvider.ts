import { ExtensionContext } from 'vscode';
import * as commands from '../commands';
import { CMD_IDENTIFIER, CommandInterfaceOrDefault, ICommandBase } from '../types';

class CommandProvider {
  private _commands: Map<CMD_IDENTIFIER, ICommandBase> = new Map();

  constructor(commands: ICommandBase[]) {
    commands.forEach((command) => {
      this._commands.set(command.cmdIdentifier, command);
    });
  }

  public getCommand<IIdentifier extends CMD_IDENTIFIER>(cmdIdentifier: IIdentifier) {
    return this._commands.get(cmdIdentifier) as unknown as CommandInterfaceOrDefault<IIdentifier>;
  }

  public getCommands(cmdIdentifiers: CMD_IDENTIFIER[]) {
    return cmdIdentifiers.map((identifier) => {
      return this._commands.get(identifier);
    });
  }

  public forEach(callback: (command: ICommandBase) => void) {
    this._commands.forEach((command) => callback(command));
  }
}

let commandProvider: CommandProvider;
export const setCommandProvider = (context: ExtensionContext) => {
  const commandInstances = Object.values(commands).map((command) => new command(context));
  commandProvider = new CommandProvider(commandInstances);
};

export const getCommandProvider = (): CommandProvider => {
  return commandProvider;
};
