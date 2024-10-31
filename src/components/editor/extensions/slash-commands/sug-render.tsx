import { ReactRenderer } from '@tiptap/react'
import { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import MenuList from './menu-list'
import { extensionName, popup } from '.'

const render = () => {
  // 存儲 ReactRenderer 實例的引用
  let component: any
  let scrollElem: HTMLElement
  let scrollYValue: string

  return {
    // 當建議菜單開始顯示時觸發
    onStart: (props: SuggestionProps) => {
      // 創建 MenuList 組件的 ReactRenderer 實例
      // 將 props 和 editor 實例傳遞給組件
      component = new ReactRenderer(MenuList, {
        props,
        editor: props.editor,
      })

      // 計算建議菜單的位置和尺寸
      // 返回一個 DOMRect 對象，包含位置和尺寸信息
      const getReferenceClientRect = () => {
        // 如果沒有 clientRect 函數，使用存儲的位置信息
        if (!props.clientRect) {
          return props.editor.storage[extensionName].rect
        }

        // 獲取當前光標位置的矩形信息
        const rect = props.clientRect()

        // 如果獲取失敗，使用存儲的位置信息
        if (!rect) {
          return props.editor.storage[extensionName].rect
        }

        let yPos = rect.y

        // 檢查建議菜單是否會超出視窗底部
        // 如果會超出，則向上調整位置
        if (
          rect.top + component.element.offsetHeight + 40 >
          window.innerHeight
        ) {
          const diff =
            rect.top + component.element.offsetHeight - window.innerHeight + 40
          yPos = rect.y - diff
        }

        // 返回調整後的位置信息
        return new DOMRect(rect.x, yPos, rect.width, rect.height)
      }

      // 設置彈出菜單的屬性並顯示
      popup?.[0].setProps({
        getReferenceClientRect, // 位置計算函數
        appendTo: () => document.body, // 將彈窗添加到 body 元素
        content: component.element, // 設置彈窗內容為 MenuList 組件
      })

      // 顯示彈出菜單
      popup?.[0].show()

      //獲取編輯器滾動的元素，和 overflowY的值
      if (!scrollElem) {
        scrollElem = document.getElementById('work-content-scroll-container')
          ?.lastElementChild as HTMLElement
        scrollYValue = scrollElem.style.overflowY
      }

      //暫時禁止編輯器滾動
      scrollElem.style.overflowY = 'hidden'
    },

    // 當建議內容更新時觸發
    onUpdate(props: SuggestionProps) {
      // 使用新的 props 更新 MenuList 組件
      component.updateProps(props)

      // 重新計算建議菜單的位置
      const getReferenceClientRect = () => {
        if (!props.clientRect) {
          return props.editor.storage[extensionName].rect
        }

        const rect = props.clientRect()

        if (!rect) {
          return props.editor.storage[extensionName].rect
        }

        // 返回新的位置信息
        return new DOMRect(rect.x, rect.y, rect.width, rect.height)
      }

      // 更新存儲的位置信息
      // 如果有 clientRect 函數則使用計算的位置，否則使用默認值
      props.editor.storage[extensionName].rect = props.clientRect
        ? getReferenceClientRect()
        : {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }

      // 更新彈出菜單的位置
      popup?.[0].setProps({
        getReferenceClientRect,
      })
    },

    // 處理鍵盤事件
    onKeyDown(props: SuggestionKeyDownProps) {
      // 按下 ESC 鍵時隱藏彈窗
      if (props.event.key === 'Escape') {
        popup?.[0].hide()
        return true
      }

      // 如果彈窗未顯示則顯示
      if (!popup?.[0].state.isShown) {
        popup?.[0].show()
      }

      // 將鍵盤事件傳遞給 MenuList 組件處理
      return component.ref?.onKeyDown(props)
    },

    // 當建議菜單退出時觸發
    onExit(props: SuggestionProps) {
      // 隱藏彈窗
      popup?.[0].hide()
      // 銷毀 ReactRenderer 實例，清理資源
      component.destroy()

      // 恢復編輯器滾動
      scrollElem.style.overflowY = scrollYValue
    },
  }
}

export default render
