import * as vscode from 'vscode';
import { Tree } from "./Tree";
import { TreeNodeType } from './types/TreeNode.type';
import createGoBackCommand from "./extension-commands/goBack";
import createGoForwardkCommand from "./extension-commands/goForward";
import createClearNavigationHistory from "./extension-commands/clearHistory";
import createSelectionListener from "./listeners/selectionListener";
import createFileOpenListener from "./listeners/fileOpenListener";

export function activate(context: vscode.ExtensionContext) {
  const isNavigating = {
    value: false
  }

  vscode.window.showInformationMessage('Guild Navigator loaded 🧭');

  const tree = new Tree();

  const goBackCommand = createGoBackCommand(tree, isNavigating);

  const goForwardCommand = createGoForwardkCommand(tree, isNavigating);

  const clearNavigationHistory = createClearNavigationHistory(tree);

  const selectionListener = createSelectionListener(tree, isNavigating);

  const fileOpenListener = createFileOpenListener(tree, isNavigating);

  context.subscriptions.push(goBackCommand, goForwardCommand, clearNavigationHistory, selectionListener, fileOpenListener);
}

export function deactivate() {}