import {
  EventEmitter,
  ExtensionContext,
  TreeDataProvider,
  TreeItem,
  Event,
  ProviderResult,
  workspace,
  window,
} from 'vscode';
import { getCommandProvider } from './CommandProvider';

export class TabGroupDataProvider implements TreeDataProvider<TreeItem> {
  private _context: ExtensionContext;
  private _onDidChangeTreeData: EventEmitter<void> = new EventEmitter<void>();
  readonly onDidChangeTreeData: Event<void> = this._onDidChangeTreeData.event;

  constructor(context: ExtensionContext) {
    this._context = context;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): ProviderResult<TreeItem[]> {
    if (element) return [];

    return this._getTreeItems();
  }

  private async _getTreeItems() {
    const commandProvider = getCommandProvider();

    // ---------------------------------------------
    // 현재 열려 있는 writable한 textDocument 모두 가져오기
    // ---------------------------------------------
    const getTextDocumentsCmd = commandProvider.getCommand<'get.textdocuments'>('get.textdocuments');
    const { done, textDocuments } = await getTextDocumentsCmd.executeAsync({ onlyWritable: true });
    if (!done) return [];

    // ---------------------------------------------
    // 가져온 textDocument 정보를 바탕으로 TreeItem 생성
    // ---------------------------------------------
    const createTreeItemCmd = commandProvider.getCommand<'create.treeitem'>('create.treeitem');
    const treeItems: TreeItem[] = [];

    for (const textDocument of textDocuments) {
      const { done, treeItem } = await createTreeItemCmd.executeAsync({
        label: workspace.asRelativePath(textDocument.uri.fsPath),
        uri: textDocument.uri,
        command: {
          command: 'open',
          title: 'Open File',
          arguments: [textDocument.uri],
        },
      });

      if (!done) continue;

      treeItems.push(treeItem);
    }

    // ---------------------------------------------
    // 결과 반환
    // ---------------------------------------------
    return treeItems;
  }
}

let tabGroupDataProvider: TabGroupDataProvider;
export const setTabGroupDataProvider = (context: ExtensionContext) => {
  tabGroupDataProvider = new TabGroupDataProvider(context);
  window.registerTreeDataProvider('tabgroup', tabGroupDataProvider);
};

export const getTabGroupDataProvider = () => {
  return tabGroupDataProvider;
};
