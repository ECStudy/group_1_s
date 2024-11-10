import * as vscode from 'vscode';
import { CommandResult, ICommandBase } from '../ICommadBase';

export type UpdateGroupChildrenParams =
  | vscode.Uri // 파일탐색기 메뉴를 통해 호출
  | vscode.TextEditor // 에디터 내 메뉴를 통해 호출
  | undefined; // 커멘드 팔레트를 통해 호출
export interface UpdateGroupChildrenResult extends CommandResult {
  //
}

export interface IUpdateGroupChildrenCmd extends ICommandBase<UpdateGroupChildrenParams, UpdateGroupChildrenResult> {}
