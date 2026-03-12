import * as vscode from 'vscode';
import { Tree } from "./Tree";
import { TreeNodeType } from './types/TreeNode.type';
import createGoBackCommand from "./extension-commands/goBack";
import createGoForwardkCommand from "./extension-commands/goForward";
import createClearNavigationHistory from "./extension-commands/clearHistory";
import createSelectionListener from "./listeners/selectionListener";

export function activate(context: vscode.ExtensionContext) {


  const isNavigating = {
    value: false
  }
  vscode.window.showInformationMessage('Guild Navigator loaded 🧭')
  const tree = new Tree();

  // Go back in navigation history
  const goBackCommand = createGoBackCommand(tree, isNavigating);

  // Go forward in navigation history
  const goForwardCommand = createGoForwardkCommand(tree, isNavigating);

  // clear navigation history
  const clearNavigationHistory = createClearNavigationHistory(tree);
  // Track navigation - fires on mouse click or command (go to definition etc.)
  // Ignores arrow key movements
  const selectionListener = createSelectionListener(tree, isNavigating);

  const fileOpenListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor) return;
    if (isNavigating) return;
    const file = editor.document.uri.fsPath
    const line = editor.selection.active.line

    const currentNode = tree.currentNode
    const isNewFile = 'file' in currentNode && currentNode.file !== file
    if (!isNewFile) return  // same file, skip

    const prevFileLatestNode = 'file' in currentNode ? (currentNode as TreeNodeType) : null

    tree.addNode({ file, line, prevFileLatestNode })
 })

  context.subscriptions.push(goBackCommand, goForwardCommand, clearNavigationHistory, selectionListener, fileOpenListener);
}

export function deactivate() {}