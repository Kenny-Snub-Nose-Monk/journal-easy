import { create } from 'zustand'
import { User } from 'next-auth'

export type ICollabUser = User & { clientId: string; avatar: string }

interface IEditorState {
  docId: string
  characterCount: number
  collaborativeState: string
  collaborativeUsers: ICollabUser[]
  AITokenLimit: number | null
  setDocId: (id: string) => void
  setCharacterCount: (count: number) => void
  setCollaborativeState: (state: string) => void
  setCollaborativeUsers: (users: ICollabUser[]) => void
  setAITokenLimit: (limit: number | null) => void
}

export const useEditorStore = create<IEditorState>((set) => ({
  docId: '',
  characterCount: 0,
  collaborativeState: 'connecting',
  collaborativeUsers: [],
  AITokenLimit: null,
  setAITokenLimit: (limit) => set({ AITokenLimit: limit }),
  setDocId: (id) => set({ docId: id }),
  setCharacterCount: (c) => set({ characterCount: c }),
  setCollaborativeState: (s) => set({ collaborativeState: s }),
  setCollaborativeUsers: (u: ICollabUser[]) => set({ collaborativeUsers: u }),
}))
