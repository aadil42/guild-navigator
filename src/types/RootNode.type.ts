import { TreeNodeType } from "./TreeNode.type";

export type RootNodeType = {
  file: null,
  line: null,
  prev:  null,
  children: TreeNodeType[],
  prevFileLatestNode: null,
  isRootNode: true
}

