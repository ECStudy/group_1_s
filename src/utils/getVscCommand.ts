import * as vscode from 'vscode';

export const getOpenFileCommand = ({ uri }: { uri: vscode.Uri }) => {
  return {
    command: 'vscode.open',
    title: 'Open File',
    arguments: [uri],
  };
};
