import * as vscode from 'vscode';
import { Tree } from "./Tree";
import { TreeNodeType } from './types/TreeNode.type';
import createGoBackCommand from "./extension-commands/goBack";
import createGoForwardkCommand from "./extension-commands/goForward";

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
  const clearNavigationHistory = vscode.commands.registerCommand('guild-navigator.clearHistory', async () => {
    vscode.window.showInformationMessage('Guild Navigator: clear history')
    tree.clearHistory();
  });
  // Track navigation - fires on mouse click or command (go to definition etc.)
  // Ignores arrow key movements
  const selectionListener = vscode.window.onDidChangeTextEditorSelection((event) => {
    
    if (isNavigating) return;
    const isMouse = event.kind === vscode.TextEditorSelectionChangeKind.Mouse
    const isCommand = event.kind === vscode.TextEditorSelectionChangeKind.Command
    if (!isMouse && !isCommand) return;

    const editor = event.textEditor
    const file = editor.document.uri.fsPath
    const line = editor.selection.active.line

    if (tree.currentNode.file === file && tree.currentNode.line === line) return;
    
    // if switching to a new file, store current node as prevFileLatestNode
    // so we can jump back to it if this file is closed
    const currentNode = tree.currentNode
    const isNewFile = 'file' in currentNode && currentNode.file !== file
    const prevFileLatestNode = isNewFile 
      ? (currentNode as TreeNodeType) 
      : ('prevFileLatestNode' in currentNode ? currentNode.prevFileLatestNode : null)
    tree.addNode({ file, line, prevFileLatestNode })
  })

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