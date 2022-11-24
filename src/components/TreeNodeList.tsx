import { JSX } from "preact/jsx-runtime"
import { TreeNode } from "../app"
import { TreeNodeItem } from "./TreeNodeItem"
import { TreeSpacer } from "./TreeSpacer"

type TreeNodeListProps = {
  depth: number
  rootId: string
  treeNodes: TreeNode[]
  isDragging: boolean
  handleCheck: (e: JSX.TargetedEvent<HTMLInputElement>) => void
  handleDelete: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
  handleDragEnd: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragEnter: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragLeave: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleToggleOpen: (e: JSX.TargetedEvent<HTMLElement>) => void
}

export const TreeNodeList = (props: TreeNodeListProps) => {
  const {
    depth,
    rootId,
    treeNodes,
    isDragging,
    handleCheck,
    handleDelete,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDragStart,
    handleDrop,
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
            isDragging={isDragging}
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
              isDragging={isDragging}
              handleToggleCheck={handleCheck}
              handleDelete={handleDelete}
              handleDragEnd={handleDragEnd}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              handleToggleOpen={handleToggleOpen}
            /> :
            <div>
              <div>
                <TreeNodeItem
                  depth={itemDepth}
                  node={node}
                  parentId={parentId}
                  isDragging={isDragging}
                  handleToggleCheck={handleCheck}
                  handleDelete={handleDelete}
                  handleDragEnd={handleDragEnd}
                  handleDragEnter={handleDragEnter}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
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
              isDragging={isDragging}
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
