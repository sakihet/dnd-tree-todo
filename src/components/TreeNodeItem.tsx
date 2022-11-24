import { JSX } from "preact/jsx-runtime"
import { TreeNode } from "../app"

type TreeNodeItemProps = {
  depth: number
  node: TreeNode
  parentId: string
  isDragging: boolean
  handleToggleCheck: (e: JSX.TargetedEvent<HTMLInputElement>) => void
  handleDelete: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
  handleDragEnd: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragEnter: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragLeave: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedEvent<HTMLDivElement>) => void
  handleToggleOpen: (e: JSX.TargetedEvent<HTMLElement>) => void
}

export const TreeNodeItem = (props: TreeNodeItemProps) => {
  const {
    depth,
    node,
    parentId,
    isDragging,
    handleToggleCheck,
    handleDelete,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDragStart,
    handleDrop,
    handleToggleOpen
  } = props

  const indentRem: number = 2

  return (
    <div class='flex-row'>
      <div style={{ 'width': `${depth * indentRem}rem`}} />
      <div
        class='bg-primary h-8 border-1 border-solid border-color-primary hover-primary f-1 flex-row'
        draggable
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        data-drop-target-node-id={node.id}
        data-drop-target-type={'node'}
        data-node-id={node.id}
        data-parent-id={parentId}
      >
        <div class={`f-1 flex-row ${isDragging ? 'pointer-events-none' : ''}`}>
          {(node.children.length !== 0) &&
            <div class='flex-column text-secondary'>
              <button
                class={`text-secondary bg-transparent border-none h-8 w-8 ${node.isOpen ? 'rotate-90': ''}`}
                onClick={handleToggleOpen}
                data-node-id={node.id}
              >▶︎</button>
            </div>
          }
          <div class='w-8 flex-column'>
            <input
              class='m-auto'
              type='checkbox'
              checked={node.isCompleted}
              onClick={handleToggleCheck}
              data-node-id={node.id}
            />
          </div>
          <div class='f-1 flex-column'>
            <span class='my-auto'>{node.name}</span>
          </div>
          <div class='flex-column mr-2'>
            <button
              class='m-auto bg-transparent border-solid border-1'
              onClick={handleDelete}
              data-node-id={node.id}
            >x</button>
          </div>
        </div>
      </div>
    </div>
  )
}
