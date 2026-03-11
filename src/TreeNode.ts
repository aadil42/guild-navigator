import { TreeNodeType } from "./types/TreeNode.type"

export class TreeNode {
  file: string
  line: number
  prev: TreeNodeType | null
  children: TreeNodeType[]
  prevFileLatestNode: TreeNodeType | null

  constructor(file: string, line: number) {
    this.file = file
    this.line = line
    this.prev = null
    this.children = []
    this.prevFileLatestNode = null
  }
}