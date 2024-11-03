import * as vscode from 'vscode';

export function isUri(obj: any): obj is vscode.Uri {
  return obj instanceof vscode.Uri;
}
