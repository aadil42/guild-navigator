import * as vscode from 'vscode';
import { Tree } from '../Tree';
import { TreeNodeType } from '../types/TreeNode.type';
import navigateToNode from '../utils/navigation';
import showBranchPicker from '../utils/showBranchPicker';

export default function createGoForwardCommand(tree: Tree, isNavigating: { value: boolean }) {
  return vscode.commands.registerCommand('guild-navigator.goForward', async () => {
    vscode.window.showInformationMessage('Guild Navigator: Going forward')
      const result = tree.goForward()
      // null means no forward history
      if (!result) return
  
      // single child - navigate directly
      if (!Array.isArray(result)) {
        isNavigating.value = true;
        await navigateToNode(result as TreeNodeType)
        isNavigating.value = false;
        return
      }
  
      // multiple children - show picker for user to choose branch
      const picked = await showBranchPicker(result as TreeNodeType[])
      if (!picked) return
      const node = tree.selectChild(picked)
      isNavigating.value = true;
      await navigateToNode(node as TreeNodeType)
      isNavigating.value = false;
  });
}