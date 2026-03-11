import { TreeNodeType } from './types/TreeNode.type'
import { RootNodeType } from './types/RootNode.type'
import { TreeNode } from './TreeNode'
import * as vscode from 'vscode'

export class Tree {
  root: RootNodeType
  currentNode: RootNodeType | TreeNodeType

  constructor() {
    this.root = {
      children: [],
      file: null,
      line: null,
      prev: null,
      prevFileLatestNode: null,
      isRootNode: true
    }
    this.currentNode = this.root
  }

  addNode({ line, file, prevFileLatestNode }: { line: number, file: string, prevFileLatestNode: TreeNodeType }) {
    const preNode = this.currentNode;
    const nextNode = new TreeNode({line, file, prev: preNode});
    nextNode.prevFileLatestNode = prevFileLatestNode
    this.currentNode.children.push(nextNode);
    const len = this.currentNode.children.length;
    this.currentNode = this.currentNode.children[len-1];
  }

}