import { TreeNodeType } from './types/TreeNode.type'
import { RootNodeType } from './types/RootNode.type'

export class Tree {
  root: RootNodeType
  currentNode: RootNodeType | TreeNodeType

  constructor() {
    this.root = {
      children: [],
      file: null,
      line: null,
      prev: null,
      prevFileLatestNode: null
    }
    this.currentNode = this.root
  }
}