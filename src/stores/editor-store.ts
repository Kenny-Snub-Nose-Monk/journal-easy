import { create } from 'zustand'

interface IEditorState {
  characterCount: number
  collaborativeState: string
  setCharacterCount: (count: number) => void
  setCollaborativeState: (state: string) => void
}

export const useEditorStore = create<IEditorState>((set) => ({
  characterCount: 0,
  collaborativeState: 'connecting',
  setCharacterCount: (c) => set({ characterCount: c }),
  setCollaborativeState: (s) => set({ collaborativeState: s }),
}))
