import * as vscode from 'vscode';

export function isUri(obj: any): obj is vscode.Uri {
  return obj instanceof vscode.Uri;
}

export function isTextEditor(obj: any): obj is vscode.TextEditor {
  return obj && typeof obj === 'object' && 'document' in obj && 'options' in obj && 'viewColumn' in obj;
}
