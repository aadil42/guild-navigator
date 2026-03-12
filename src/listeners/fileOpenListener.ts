import * as vscode from 'vscode';
import { Tree } from '../Tree';
import { TreeNodeType } from '../types/TreeNode.type';

export default function createFileOpenListener(tree: Tree, isNavigating: { value: boolean }) {
    return vscode.window.onDidChangeActiveTextEditor((editor) => {
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
}

