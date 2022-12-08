import { JSX } from "preact/jsx-runtime"
import { TreeNode } from "../app"

type SpacerPosition = 'first' | 'last' | 'theOthers'

type TreeSpacerProps = {
  depth: number
  node: TreeNode | null
  parentId: string
  position : SpacerPosition
  isDragging: boolean
  handleDragEnter: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export const TreeSpacer = (props: TreeSpacerProps) => {
  const {
    depth,
    node,
    parentId,
    position,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = props

  const indentRem: number = 2

  return (
    <div class='flex-row'>
      <div style={{ 'width': `${depth * indentRem}rem`}} />
      <div
        class='f-1 w-full py-2'
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-drop-target-type={'spacer'}
        data-first={position === 'first' || null}
        data-last={position === 'last' || null}
        data-next-id={node ? node.id : null}
        data-parent-id={parentId}
      >
        <div class={`border-solid border-spacer border-color-primary ${isDragging ? 'pointer-events-none' : ''}`} />
      </div>
    </div>
  )
}
