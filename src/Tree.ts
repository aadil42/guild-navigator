import { TreeNodeType } from './types/TreeNode.type'
import { RootNodeType } from './types/RootNode.type'
import { TreeNode } from './TreeNode'
import * as vscode from 'vscode'

export class Tree {
  root: RootNodeType;
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

  addNode({ line, file, prevFileLatestNode }: { line: number, file: string, prevFileLatestNode: TreeNodeType | null }) {
    const preNode = this.currentNode;
    const nextNode = new TreeNode({line, file, prev: preNode});
    nextNode.prevFileLatestNode = prevFileLatestNode
    this.currentNode.children.push(nextNode);
    const len = this.currentNode.children.length;
    this.currentNode = this.currentNode.children[len-1];
  }

  goBack() {

    console.log('goback from class');
    console.log('file', this.currentNode.file);
    console.log('line', this.currentNode.line);
    if (!this.currentNode.prev) return null; // What if we never did navigate and just sitting at the rootnode and try to go back.
    if ((this.currentNode.prev as RootNodeType).isRootNode) return null; // if the prev node is root node then we should not go to that. 

    this.currentNode = this.currentNode.prev;
    return this.currentNode;
  }

  goForward() {

    console.log('goforward');
    console.log('file', this.currentNode.file);
    console.log('line', this.currentNode.line);
    if (!this.currentNode.children.length) return null;

    if (this.currentNode.children.length === 1) {
      this.currentNode = this.currentNode.children[0];
      return this.currentNode;
    }
    
    // more than one children. We many path to choose from.
    return this.currentNode.children;
  }

  selectChild(node: TreeNodeType) {
    this.currentNode = node;
    return this.currentNode;
  }

  clearHistory() {
    this.currentNode = this.root;
    this.reset();
  }

  reset() {
    this.root = {
      children: [],
      file: null,
      line: null,
      prev: null,
      prevFileLatestNode: null,
      isRootNode: true
    }
  }
}