export class TreeNode {
  file: string
  line: number
  prev: TreeNode | null
  children: TreeNode[]
  prevFileLatestNode: TreeNode | null

  constructor(file: string, line: number) {
    this.file = file
    this.line = line
    this.prev = null
    this.children = []
    this.prevFileLatestNode = null
  }
}