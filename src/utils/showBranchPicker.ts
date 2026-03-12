import * as vscode from 'vscode';
import { TreeNodeType } from '../types/TreeNode.type';

// Shows a quick pick popup when there are multiple forward paths
// User picks which branch to navigate to
export default async function showBranchPicker(nodes: TreeNodeType[]): Promise<TreeNodeType | null> {
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