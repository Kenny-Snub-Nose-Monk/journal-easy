import { create } from 'zustand'

interface IEditorState {
  characterCount: number
  setCharacterCount: (count: number) => void
}

export const useEditorStore = create<IEditorState>((set) => ({
  characterCount: 0,
  setCharacterCount: (c) => set({ characterCount: c }),
}))
