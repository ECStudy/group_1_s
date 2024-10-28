import { workspace, TextDocument } from 'vscode';
import { CommandBase } from './CommandBase';
import { command } from '../decorator';
import { GetTextDocumentsParams, GetTextDocumentsResult, IGetTextDocumentsCmd } from '../types';
const fs = require('fs');

@command({ identifier: 'get.textdocuments', handler: getTextDocumentsHandler })
export class GetTextDocumentsCmd
  extends CommandBase<GetTextDocumentsParams, GetTextDocumentsResult>
  implements IGetTextDocumentsCmd {}

function getTextDocumentsHandler({ onlyWritable }: GetTextDocumentsParams): GetTextDocumentsResult {
  const openedDocuments = [...workspace.textDocuments];

  if (onlyWritable) {
    const writableDocuments = openedDocuments.filter((file) => {
      const filePath = file.uri.fsPath;
      try {
        const stats = fs.statSync(filePath);
        return !(stats.mode & fs.constants.W_OK); // 읽기 전용이면 false
      } catch (error) {
        return false;
      }
    });

    return { done: true, textDocuments: writableDocuments };
  }

  return { done: true, textDocuments: openedDocuments };
}
