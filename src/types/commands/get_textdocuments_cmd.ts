import { TextDocument } from 'vscode';
import { CommandParams, CommandResult, ICommandBase } from '../Command';

export interface GetTextDocumentsParams extends CommandParams {
  onlyWritable?: boolean;
}

export interface GetTextDocumentsResult extends CommandResult {
  textDocuments: TextDocument[];
}

export interface IGetTextDocumentsCmd extends ICommandBase<GetTextDocumentsParams, GetTextDocumentsResult> {}
