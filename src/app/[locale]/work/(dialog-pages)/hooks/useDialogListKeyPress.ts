import { useEffect, useState } from 'react'
import { IDoc } from '@/stores/docs-store'

interface IParams {
  list: IDoc[]
  setKeyword: React.Dispatch<React.SetStateAction<string>>
  handleClick: (doc: IDoc) => void
}

export default function useDialogListKeyPress({ list, setKeyword, handleClick }: IParams) {
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Let input methods and browser shortcuts finish before navigating results.
      if (event.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey) return
      if (list.length === 0) return

      if (event.key === 'Enter') {
        const currentDoc = list[currentIndex]
        if (!currentDoc) return
        event.preventDefault()
        handleClick(currentDoc)
        return
      }

      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
      event.preventDefault()
      const nextIndex =
        event.key === 'ArrowUp'
          ? currentIndex <= 0 || currentIndex >= list.length
            ? list.length - 1
            : currentIndex - 1
          : currentIndex >= list.length - 1
            ? 0
            : currentIndex + 1
      setCurrentIndex(nextIndex)
      setKeyword(list[nextIndex].title)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [currentIndex, list, setKeyword, handleClick])

  return { currentIndex, setCurrentIndex }
}
