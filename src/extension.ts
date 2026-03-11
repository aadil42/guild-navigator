import * as vscode from 'vscode';
import { Tree } from "./Tree";
import { TreeNodeType } from './types/TreeNode.type';

// Navigates VS Code editor to a specific file and line
async function navigateToNode(node: TreeNodeType) {
  const document = await vscode.workspace.openTextDocument(node.file)
  const editor = await vscode.window.showTextDocument(document)
  const position = new vscode.Position(node.line, 0)
  editor.selection = new vscode.Selection(position, position)
  editor.revealRange(new vscode.Range(position, position))
}

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
  vscode.window.showInformationMessage('Guild Navigator loaded 🧭')
  const tree = new Tree();

  // Go back in navigation history
  const goBackCommand = vscode.commands.registerCommand('guild-navigator.goBack', async () => {
	vscode.window.showInformationMessage('Guild Navigator: Going back')
    const node = tree.goBack()
    // null means we're at root, nothing to go back to
    if (!node) return
    // root node has no file, skip
    if (!('file' in node)) return
    await navigateToNode(node as TreeNodeType)
  });

  // Go forward in navigation history
  const goForwardCommand = vscode.commands.registerCommand('guild-navigator.goForward', async () => {
	vscode.window.showInformationMessage('Guild Navigator: Going forward')
    const result = tree.goForward()
    // null means no forward history
    if (!result) return

    // single child - navigate directly
    if (!Array.isArray(result)) {
      await navigateToNode(result as TreeNodeType)
      return
    }

    // multiple children - show picker for user to choose branch
    const picked = await showBranchPicker(result as TreeNodeType[])
    if (!picked) return
    const node = tree.selectChild(picked)
    await navigateToNode(node as TreeNodeType)
  });

  // clear navigation history
  const clearNavigationHistory = vscode.commands.registerCommand('guild-navigator.clearHistory', async () => {
    vscode.window.showInformationMessage('Guild Navigator: clear history')
    tree.clearHistory();
  });
  // Track navigation - fires on mouse click or command (go to definition etc.)
  // Ignores arrow key movements
  vscode.window.onDidChangeTextEditorSelection((event) => {
    
    const isMouse = event.kind === vscode.TextEditorSelectionChangeKind.Mouse
    const isCommand = event.kind === vscode.TextEditorSelectionChangeKind.Command
    if (!isMouse && !isCommand) return

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

    vscode.window.showInformationMessage(`addNode: ${file} line ${line}`)
    tree.addNode({ file, line, prevFileLatestNode })
  })

  context.subscriptions.push(goBackCommand, goForwardCommand, clearNavigationHistory)
}

export function deactivate() {}