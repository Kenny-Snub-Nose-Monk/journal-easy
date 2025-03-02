import { create } from 'zustand'
import { User } from 'next-auth'

export type ICollabUser = User & { clientId: string; avatar: string }

interface IEditorState {
  characterCount: number
  collaborativeState: string
  collaborativeUsers: ICollabUser[]
  setCharacterCount: (count: number) => void
  setCollaborativeState: (state: string) => void
  setCollaborativeUsers: (users: ICollabUser[]) => void
}

export const useEditorStore = create<IEditorState>((set) => ({
  characterCount: 0,
  collaborativeState: 'connecting',
  collaborativeUsers: [],
  setCharacterCount: (c) => set({ characterCount: c }),
  setCollaborativeState: (s) => set({ collaborativeState: s }),
  setCollaborativeUsers: (u: ICollabUser[]) => set({ collaborativeUsers: u }),
}))
