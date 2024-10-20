import { ExtensionContext } from 'vscode';
import * as commands from '../commands';
import { CommandHandler } from '../base';

const CmdHandler = 'cmdHandler';

export const setCmdHandler = (context: ExtensionContext) => {
  const commandInstances = Object.values(commands).map((command) => new command(context));
  const cmdHandler = new CommandHandler(commandInstances);

  context.globalState.update(CmdHandler, cmdHandler);
};

export const getCmdHandler = (context: ExtensionContext): CommandHandler => {
  return context.globalState.get(CmdHandler) as CommandHandler;
};
