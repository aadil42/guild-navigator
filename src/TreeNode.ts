import { RootNodeType } from "./types/RootNode.type"
import { TreeNodeType } from "./types/TreeNode.type"

export class TreeNode {
  file: string
  line: number
  prev: TreeNodeType | RootNodeType
  children: TreeNodeType[]
  prevFileLatestNode: TreeNodeType | null
  isRootNode: boolean
  
  constructor({ file, line, prev }: { file: string, line: number, prev: TreeNodeType | RootNodeType}) {
    this.file = file
    this.line = line
    this.prev = prev
    this.children = []
    this.prevFileLatestNode = null
    this.isRootNode = false
  }
}