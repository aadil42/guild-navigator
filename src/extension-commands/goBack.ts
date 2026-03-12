import * as vscode from 'vscode';
import { Tree } from '../Tree';
import { TreeNodeType } from '../types/TreeNode.type';
import navigateToNode from '../utils/navigation';

export default function createGoBackCommand(tree: Tree, isNavigating: { value: boolean }) {
  return vscode.commands.registerCommand('guild-navigator.goBack', async () => {
    vscode.window.showInformationMessage('Guild Navigator: Going back')
    const node = tree.goBack()
    // null means we're at root, nothing to go back to
    if (!node) return
    // root node has no file, skip
    if (!node.file) return

    // setting isNavigating to true and then false because if we don't do it then when navigating to new file or line.
    // we'll trigger the event listener for going to new line or file and that will add node and pollute the tree.
    isNavigating.value = true;
    await navigateToNode(node as TreeNodeType);
    // done navigating
    isNavigating.value = false;
  });
}