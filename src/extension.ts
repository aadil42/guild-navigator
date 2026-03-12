import * as vscode from 'vscode';
import { Tree } from "./Tree";
import { TreeNodeType } from './types/TreeNode.type';
import navigateToNode from "./utils/navigation";

// Shows a quick pick popup when there are multiple forward paths
// User picks which branch to navigate to
async function showBranchPicker(nodes: TreeNodeType[]): Promise<TreeNodeType | null> {
  const items = nodes.map((node, index) => ({
    label: `$(file) ${node.file.split('/').pop()}`,
    description: `Line ${node.line + 1}`,
    index
  }))

  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: 'Choose which path to follow'
  })

  if (!picked) return null
  return nodes[picked.index]
}

export function activate(context: vscode.ExtensionContext) {

  let isNavigating = false;

  vscode.window.showInformationMessage('Guild Navigator loaded 🧭')
  const tree = new Tree();

  // Go back in navigation history
  const goBackCommand = vscode.commands.registerCommand('guild-navigator.goBack', async () => {
	vscode.window.showInformationMessage('Guild Navigator: Going back')
    const node = tree.goBack()
    // null means we're at root, nothing to go back to
    if (!node) return
    // root node has no file, skip
    if (!node.file) return

    // setting isNaivgating to true and then false because if we don't do it then when navigating to new file or line.
    //  we'll trigger the event listner for going to new line or file and that will add node and polute the tree. 
    isNavigating = true;
    await navigateToNode(node as TreeNodeType);
    // done navigating
    isNavigating = false;
  });

  // Go forward in navigation history
  const goForwardCommand = vscode.commands.registerCommand('guild-navigator.goForward', async () => {
	vscode.window.showInformationMessage('Guild Navigator: Going forward')
    const result = tree.goForward()
    // null means no forward history
    if (!result) return

    // single child - navigate directly
    if (!Array.isArray(result)) {
      isNavigating = true;
      await navigateToNode(result as TreeNodeType)
      isNavigating = false;
      return
    }

    // multiple children - show picker for user to choose branch
    const picked = await showBranchPicker(result as TreeNodeType[])
    if (!picked) return
    const node = tree.selectChild(picked)
    isNavigating = true;
    await navigateToNode(node as TreeNodeType)
    isNavigating = false;
  });

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