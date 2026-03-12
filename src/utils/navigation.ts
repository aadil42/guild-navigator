import * as vscode from 'vscode';
import { TreeNodeType } from '../types/TreeNode.type';

// Navigates VS Code editor to a specific file and line
export default async function navigateToNode(node: TreeNodeType) {
  const document = await vscode.workspace.openTextDocument(node.file)
  const editor = await vscode.window.showTextDocument(document)
  const position = new vscode.Position(node.line, 0)
  editor.selection = new vscode.Selection(position, position)
  editor.revealRange(new vscode.Range(position, position))
}

