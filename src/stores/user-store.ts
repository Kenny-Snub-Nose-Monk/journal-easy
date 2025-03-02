import { create } from 'zustand'
import { User } from 'next-auth'

interface IUserState {
  userInfo: User | null
  setUserInfo: (user: User) => void
}

export const useUserStore = create<IUserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
}))
