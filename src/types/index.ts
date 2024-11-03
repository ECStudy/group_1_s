// --------------------------------------
// command identifier
// --------------------------------------
import { ACTION, FEATURE, MODIFIER } from '../enums';
import { ICommandBase } from './ICommadBase';
export type CMD_IDENTIFIER = `${ACTION}.${FEATURE}` | `${ACTION}.${FEATURE}.${MODIFIER}`;

// --------------------------------------
// command interface, params, result
// --------------------------------------
export * from './commands';
export * from './ICommadBase';

// --------------------------------------
// command interface mapper
// --------------------------------------
import { ICreateGroupCmd, IGetGroupNameCmd } from './commands';

type command_types = {
  ['create.group']: ICreateGroupCmd;
  ['get.group.name']: IGetGroupNameCmd;
};

export type CommandInterfaceOrDefault<T extends CMD_IDENTIFIER> = T extends keyof command_types
  ? command_types[T]
  : ICommandBase;

type a = CommandInterfaceOrDefault<'create.treeitem'>;
