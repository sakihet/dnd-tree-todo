import { JSX } from "preact/jsx-runtime"
import { TreeNode } from "../app"
import { TreeNodeItem } from "./TreeNodeItem"
import { TreeSpacer } from "./TreeSpacer"

type TreeNodeListProps = {
  depth: number
  rootId: string
  treeNodes: TreeNode[]
  isDragStarted: boolean
  handleDelete: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void
  handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragEnter: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleToggleCheck: (e: JSX.TargetedMouseEvent<HTMLInputElement>) => void
  handleToggleOpen: (e: JSX.TargetedMouseEvent<HTMLElement>) => void
}

export const TreeNodeList = (props: TreeNodeListProps) => {
  const {
    depth,
    rootId,
    treeNodes,
    isDragStarted,
    handleDelete,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDragStart,
    handleDrop,
    handleToggleCheck,
    handleToggleOpen
  } = props

  const listItems = (nodes: TreeNode[], itemDepth: number = 0, parentId: string) => (
    nodes.map((node, index, array) =>
      <div>
        <li key={`spacer-above-${node.id}`}>
          <TreeSpacer
            depth={itemDepth}
            node={node}
            parentId={parentId}
            position={index === 0 ? 'first' : 'theOthers'}
            isDragging={isDragStarted}
            handleDragEnter={handleDragEnter}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        </li>
        <li key={`node-${node.id}`}>
          {node.children.length === 0 ?
            <TreeNodeItem
              depth={itemDepth}
              node={node}
              parentId={parentId}
              isDragStarted={isDragStarted}
              handleDelete={handleDelete}
              handleDragEnd={handleDragEnd}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              handleToggleCheck={handleToggleCheck}
              handleToggleOpen={handleToggleOpen}
            /> :
            <div>
              <div>
                <TreeNodeItem
                  depth={itemDepth}
                  node={node}
                  parentId={parentId}
                  isDragStarted={isDragStarted}
                  handleDelete={handleDelete}
                  handleDragEnd={handleDragEnd}
                  handleDragEnter={handleDragEnter}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  handleToggleCheck={handleToggleCheck}
                  handleToggleOpen={handleToggleOpen}
                />
              </div>
              {node.isOpen &&
                <ul class='list-style-none pl-0 m-0'>{listItems(node.children, itemDepth + 1, node.id)}</ul>
              }
            </div>
          }
        </li>
        {index === array.length - 1 &&
          <li key={`spacer-below-${node.id}`}>
            <TreeSpacer
              depth={itemDepth}
              node={null}
              parentId={parentId}
              position={'last'}
              isDragging={isDragStarted}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />
          </li>
        }
      </div>
    )
  )

  return (
    <ul class='list-style-none pl-0 m-0'>{listItems(treeNodes, depth, rootId)}</ul>
  )
}
