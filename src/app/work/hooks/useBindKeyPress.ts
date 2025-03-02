import { useKeyPress } from 'ahooks'
import { useState } from 'react'
import { IDoc } from '@/stores/docs-store'

interface IParams {
  list: IDoc[]
  setKeyword: React.Dispatch<React.SetStateAction<string>>
  handleClick: (doc: IDoc) => void
}

export default function useBindKeyPress(params: IParams) {
  const { list = [], setKeyword, handleClick } = params
  // 當前元素的索引（用於高亮元素）
  const [currentIndex, setCurrentIndex] = useState(-1)
  // 下一個索引
  let nextIndex = -1
  // 下一個關鍵字（用於搜索框中顯示的文案）
  let nextKeyword = ''

  // 列表的長度
  const listLength = list.length

  // 當前索引的文章
  const currentDoc = list[currentIndex]

  // 處理鍵盤上鍵的回調
  useKeyPress('uparrow', (e: KeyboardEvent) => {
    e.preventDefault()

    if (currentIndex > 0) {
      nextIndex = currentIndex - 1

      setCurrentIndex(nextIndex)

      const nextDoc = list[nextIndex]
      if (!nextDoc) return
      nextKeyword = nextDoc.title
      setKeyword(nextKeyword)
    } else {
      nextIndex = listLength - 1
      setCurrentIndex(nextIndex)

      const nextDoc = list[nextIndex]
      if (!nextDoc) return
      nextKeyword = nextDoc.title
      setKeyword(nextKeyword)
    }
  })

  // 處理鍵盤下鍵的回調
  useKeyPress('downarrow', (e: KeyboardEvent) => {
    e.preventDefault()

    if (currentIndex >= listLength - 1) {
      nextIndex = 0

      setCurrentIndex(nextIndex)

      const nextDoc = list[nextIndex]
      if (!nextDoc) return
      nextKeyword = nextDoc.title
      setKeyword(nextKeyword)
    } else {
      nextIndex = currentIndex + 1
      setCurrentIndex(currentIndex + 1)

      const nextDoc = list[nextIndex]
      nextKeyword = nextDoc.title
      setKeyword(nextKeyword)
    }
  })

  // 處理回車確定選擇文章的回調
  useKeyPress('Enter', (e: KeyboardEvent) => {
    e.preventDefault()
    if (!currentDoc) return
    handleClick(currentDoc)
  })

  return { currentIndex, setCurrentIndex }
}
