// --------------------------------------
// command identifier
// --------------------------------------
import { ACTION, FEATURE, MODIFIER, CMD_TYPE } from '../enums';
import { ICommandBase } from './ICommadBase';
export type CMD_IDENTIFIER = `${CMD_TYPE}.${ACTION}.${FEATURE}` | `${CMD_TYPE}.${ACTION}.${FEATURE}.${MODIFIER}`;

// --------------------------------------
// command interface, params, result
// --------------------------------------
export * from './commands';
export * from './ICommadBase';

// --------------------------------------
// command interface mapper
// --------------------------------------
import {
  ICreateGroupCmd,
  IDeleteGroupCmd,
  IDeleteTabCmd,
  IGetGroupNameCmd,
  IGetTabNameCmd,
  IOpenGroupChildrenCmd,
  IUpdateGroupChildrenCmd,
  IUpdateGroupNameCmd,
} from './commands';

type command_types = {
  ['extension.create.group']: ICreateGroupCmd;
  ['extension.update.group.children']: IUpdateGroupChildrenCmd;
  ['internal.get.group.name']: IGetGroupNameCmd;
  ['internal.get.tab.name']: IGetTabNameCmd;
  ['extension.delete.tab']: IDeleteTabCmd;
  ['extension.delete.group']: IDeleteGroupCmd;
  ['extension.update.group.name']: IUpdateGroupNameCmd;
  ['extension.open.group.children']: IOpenGroupChildrenCmd;
};

export type CommandInterfaceOrDefault<T extends CMD_IDENTIFIER> = T extends keyof command_types
  ? command_types[T]
  : ICommandBase;

// --------------------------------------
// quick pick
// --------------------------------------
export * from './quick_pick';

// --------------------------------------
// tab, group
// --------------------------------------
import * as vscode from 'vscode';
export interface TabAttr {
  id: string;
  resourceUri: vscode.Uri;
  command?: vscode.Command;
}
export interface TabAttrWithGroupId extends TabAttr {
  groupId: string;
}
export interface ITreeItem {
  id: string;
  parentId?: string;
  resourceUri?: vscode.Uri;
}
