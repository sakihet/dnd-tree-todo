import { useEffect, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import './app.css'
import { TreeNodeList } from './components/TreeNodeList'
import { addNode, deleteNode, isParent, moveBetweenNodes, moveToFirstChild, moveToLastChild, toggleNodeCompleted, toggleNodeOpen } from './treeUtils'

const STORAGE_KEY = 'treeNode'

export type TreeNode = {
  id: string
  name: string
  isCompleted: boolean
  isOpen: boolean
  children: TreeNode[]
}

export type DropTargetType = 'node' | 'spacer'

export function App() {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [treeNode, setTreeNode] = useState<TreeNode>({
    id: 'root',
    name: '',
    isCompleted: false,
    isOpen: true,
    children: [],
  })

  useEffect(() => {
    const item = localStorage.getItem(STORAGE_KEY)
    if (item) {
      setTreeNode(JSON.parse(item))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(treeNode))
  }, [treeNode])

  const canDrop = (root: TreeNode, draggingNodeId: string, dropTargetNodeId: string): boolean => {
    if (!isParent(root, dropTargetNodeId, draggingNodeId)) {
      return true
    }
    return false
  }

  const onInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    setNewTaskName(e.currentTarget.value)
  }

  const onSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = Math.floor(Math.random() * 10000).toString()
    const newNode: TreeNode = {
      id: id,
      name: newTaskName,
      isCompleted: false,
      isOpen: true,
      children: []
    }
    setTreeNode({...addNode(treeNode, newNode)})
    setNewTaskName('')
  }

  const handleClickClear = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setTreeNode({...treeNode, children: []})
  }

  const handleDelete = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    const nodeId = e.currentTarget.dataset.nodeId
    if (nodeId) {
      if (confirm('Do you really want to delete it?')) {
        setTreeNode({...deleteNode(treeNode, nodeId)})
      }
    }
  }

  const handleDragEnd = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    setDraggingId(null)
  }

  const handleDragEnter = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const { first, last, parentId, nextId, nodeId, dropTargetType } = e.currentTarget.dataset
    if (draggingId && parentId) {
      if (dropTargetType === 'node') {
        canDrop(treeNode, draggingId, parentId) ?
          e.currentTarget.classList.add('droppable-node') :
          e.currentTarget.classList.add('undroppable-node')
      } else if (dropTargetType === 'spacer') {
        canDrop(treeNode, draggingId, parentId) ?
          e.currentTarget.classList.add('droppable-spacer') :
          e.currentTarget.classList.add('undroppable-spacer')
      }
    }
  }

  const handleDragLeave = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    removeDroppableStyles(e.currentTarget)
  }

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    e.preventDefault() // enable drop event
  }

  const handleDragStart = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    setDraggingId(e.currentTarget.dataset.nodeId || null)
  }

  const removeDroppableStyles = (target: HTMLDivElement) => {
    target.classList.remove('droppable-node')
    target.classList.remove('undroppable-node')
    target.classList.remove('droppable-spacer')
    target.classList.remove('undroppable-spacer')
  }

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {first, last, parentId, nextId, dropTargetType, nodeId} = e.currentTarget.dataset
    if (draggingId && parentId) {
      if (dropTargetType === 'node' && nodeId && canDrop(treeNode, draggingId, nodeId)) {
        setTreeNode({...moveToFirstChild(treeNode, draggingId, nodeId)})
      } else if (dropTargetType === 'spacer') {
        if (first && canDrop(treeNode, draggingId, parentId)) {
          setTreeNode({...moveToFirstChild(treeNode, draggingId, parentId)})
        } else if (last && canDrop(treeNode, draggingId, parentId)) {
          setTreeNode({...moveToLastChild(treeNode, draggingId, parentId)})
        } else if (nextId && canDrop(treeNode, draggingId, nextId)){
          setTreeNode({...moveBetweenNodes(treeNode, draggingId, parentId, nextId)})
        }
      }
    }
    removeDroppableStyles(e.currentTarget)
  }

  const handleToggleCheck = (e: JSX.TargetedMouseEvent<HTMLInputElement>) => {
    const nodeId = e.currentTarget.dataset.nodeId
    if (nodeId) {
      setTreeNode({...toggleNodeCompleted(treeNode, nodeId)})
    }
  }

  const handleToggleOpen = (e: JSX.TargetedMouseEvent<HTMLElement>) => {
    const nodeId = e.currentTarget.dataset.nodeId
    if (nodeId) {
      setTreeNode({...toggleNodeOpen(treeNode, nodeId)})
    }
  }

  return (
    <div class='flex-column' style='min-height: 100vh;'>
      <div class='my-4 text-center'>
        <h1>DnD Tree Todo</h1>
      </div>
      <div class='f-1'>
        <div class='layout-center'>
          <div class='layout-stack-8'>
            <div class='text-right'>
              <button onClick={handleClickClear}>Clear</button>
            </div>
            <form
              class=''
              type='submit'
              onSubmit={onSubmit}
            >
              <input
                class='h-8 w-full border-1 border-solid border-color-primary'
                type='text'
                onInput={onInput}
                value={newTaskName}
                placeholder='Add a task'
              />
            </form>
            <TreeNodeList
              depth={0}
              treeNodes={treeNode.children}
              rootId={treeNode.id}
              isDragStarted={draggingId ? true : false}
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
        </div>
      </div>
      <div class='text-center h-6 text-secondary text-small'>
        <a href='https://github.com/sakihet/dnd-tree-todo'>GitHub</a>
      </div>
    </div>
  )
}
