import * as vscode from 'vscode';
import { command } from '../decorator';
import { CommandBase } from './CommandBase';
import { OpenGroupChildrenParams, OpenGroupChildrenResult, IOpenGroupChildrenCmd } from '../types';
import { getTabGroupDataProvider } from '../provider';

@command({
  identifier: 'extension.open.group.children',
  handler: openGroupChildrenHandler,
})
export class OpenGroupChildrenCmd
  extends CommandBase<OpenGroupChildrenParams, OpenGroupChildrenResult>
  implements IOpenGroupChildrenCmd {}

async function openGroupChildrenHandler(params: OpenGroupChildrenParams): Promise<OpenGroupChildrenResult> {
  const tabGroupDataProvider = getTabGroupDataProvider();
  const group = tabGroupDataProvider.getGroup(params.id);

  // await vscode.commands.executeCommand('workbench.action.closeAllEditors');

  await Promise.all(
    group.children.map(({ resourceUri }, index) => {
      if (!resourceUri) return;
      return vscode.window.showTextDocument(resourceUri, {
        preview: false,
        viewColumn: index === 0 ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
      });
    })
  );

  return { done: true };
}
