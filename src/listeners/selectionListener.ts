import * as vscode from 'vscode';
import { Tree } from '../Tree';
import { TreeNodeType } from '../types/TreeNode.type';

export default function createSelectionListener(tree: Tree, isNavigating: { value: boolean }) {
   return vscode.window.onDidChangeTextEditorSelection((event) => {
        if (isNavigating.value) return;
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
   });
}

