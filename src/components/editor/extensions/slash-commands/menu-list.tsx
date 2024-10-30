import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Command, MenuListProps } from './types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

/**
 * 斜線命令菜單列表組件
 * 用於顯示和處理斜線命令的下拉菜單
 */
const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  // 滾動容器的引用
  const scrollContainer = useRef<HTMLDivElement>(null)
  // 當前活動項的引用
  const activeItem = useRef<HTMLButtonElement>(null)
  // 當前選中的組索引
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  // 當前選中的命令索引
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  /**
   * 當命令列表變化時重置選中狀態
   * 將組索引和命令索引都重置為0
   */
  useEffect(() => {
    setSelectedGroupIndex(0)
    setSelectedCommandIndex(0)
  }, [props.items])

  /**
   * 選中並執行指定的命令
   * @param groupIndex 組索引
   * @param commandIndex 命令索引
   */
  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex]
      props.command(command) // 執行命令回調
    },
    [props]
  )

  /**
   * 暴露給父組件的方法
   * 主要用於處理鍵盤事件
   */
  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      // 處理向下箭頭鍵
      if (event.key === 'ArrowDown') {
        if (!props.items.length) {
          return false
        }

        const commands = props.items[selectedGroupIndex].commands

        let newCommandIndex = selectedCommandIndex + 1
        let newGroupIndex = selectedGroupIndex

        // 如果當前組的命令已到末尾,切換到下一組的第一個命令
        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0
          newGroupIndex = selectedGroupIndex + 1
        }

        // 如果已是最後一組,循環回到第一組
        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      // 處理向上箭頭鍵
      if (event.key === 'ArrowUp') {
        if (!props.items.length) {
          return false
        }

        let newCommandIndex = selectedCommandIndex - 1
        let newGroupIndex = selectedGroupIndex

        // 如果當前組的命令已到開頭,切換到上一組的最後一個命令
        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
        }

        // 如果已是第一組,循環到最後一組
        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1
          newCommandIndex = props.items[newGroupIndex].commands.length - 1
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      // 處理回車鍵
      if (event.key === 'Enter') {
        if (
          !props.items.length ||
          selectedGroupIndex === -1 ||
          selectedCommandIndex === -1
        ) {
          return false
        }

        selectItem(selectedGroupIndex, selectedCommandIndex)
        return true
      }

      return false
    },
  }))

  /**
   * 處理滾動位置
   * 確保當前選中項始終可見
   */
  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop
      const offsetHeight = activeItem.current.offsetHeight

      scrollContainer.current.scrollTop = offsetTop - offsetHeight
    }
  }, [selectedCommandIndex, selectedGroupIndex])

  /**
   * 創建命令點擊處理函數
   * @param groupIndex 組索引
   * @param commandIndex 命令索引
   */
  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex)
      }
    },
    [selectItem]
  )

  // 如果沒有命令項,返回null
  if (!props.items.length) {
    return null
  }

  return (
    <ScrollArea
      ref={scrollContainer}
      className="border rounded shadow-lg bg-background max-h-[min(80vh, 24rem)] overflow-auto flex-wrap mb-8 p-3"
    >
      <div className="grid grid-cols-1 gap-0.5">
        {props.items.map((group, groupIndex: number) => (
          <React.Fragment key={`${group.title}-wrapper`}>
            {/* 渲染組標題 */}
            <div
              className="text-neutal-500 text-[0.65rem] col-[1/-1] mx-2 my-2 font-semibold tracking-wider select-none uppercase first:mt-0.5"
              key={`${group.title}`}
            >
              {group.title}
            </div>

            {/* 渲染該組下的所有命令 */}
            {group.commands.map((command: Command, commandIndex: number) => {
              const isActive =
                selectedGroupIndex === groupIndex &&
                selectedCommandIndex === commandIndex

              return (
                <Button
                  key={command.name}
                  onClick={createCommandClickHandler(groupIndex, commandIndex)}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="h-auto justify-start px-2"
                >
                  <command.Icon className="w-4 h-4 mr-2" />
                  {command.label}
                </Button>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
})

MenuList.displayName = 'MenuList'

export default MenuList
