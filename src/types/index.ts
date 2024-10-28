// --------------------------------------
// command identifier
// --------------------------------------
import { ACTION, FEATURE, MODIFIER } from '../enums';
import { ICommandBase } from './Command';
export type CMD_IDENTIFIER = `${ACTION}.${FEATURE}` | `${ACTION}.${FEATURE}.${MODIFIER}`;

// --------------------------------------
// command interface, params, result
// --------------------------------------
export * from './commands';
export * from './Command';

// --------------------------------------
// command interface mapper
// --------------------------------------
import { ICreateTreeItemCmd, IGetTextDocumentsCmd } from './commands';

type command_types = {
  ['create.treeitem']: ICreateTreeItemCmd;
  ['get.textdocuments']: IGetTextDocumentsCmd;
};

export type CommandInterfaceOrDefault<T extends CMD_IDENTIFIER> = T extends keyof command_types
  ? command_types[T]
  : ICommandBase;

type a = CommandInterfaceOrDefault<'create.treeitem'>;
