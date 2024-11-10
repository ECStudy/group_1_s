import * as vscode from 'vscode';
import { CommandResult, ICommandBase } from '../ICommadBase';

export type GetTabNameParams =
  | vscode.Uri // 파일탐색기 메뉴를 통해 호출
  | vscode.TextEditor // 에디터 내 메뉴를 통해 호출
  | undefined; // 커멘드 팔레트를 통해 호출
export interface GetTabNameResult extends CommandResult {
  name: string;
}

export interface IGetTabNameCmd extends ICommandBase<GetTabNameParams, GetTabNameResult> {}
