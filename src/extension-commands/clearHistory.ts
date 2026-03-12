import * as vscode from 'vscode';
import { Tree } from '../Tree';

export default function createClearNavigationHistory(tree: Tree) {
    return vscode.commands.registerCommand('guild-navigator.clearHistory', async () => {
        vscode.window.showInformationMessage('Guild Navigator: clear history')
        tree.clearHistory();
    });
}