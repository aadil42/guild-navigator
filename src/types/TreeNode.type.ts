import { RootNodeType } from "./RootNode.type"

export type TreeNodeType = {
  file: string,
  line: number,
  prev:  TreeNodeType | RootNodeType,
  children: TreeNodeType[],
  prevFileLatestNode: TreeNodeType | null,
}
