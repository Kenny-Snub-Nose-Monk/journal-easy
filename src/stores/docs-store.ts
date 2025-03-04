import { create } from 'zustand'
import { SHARE_DOC_LIST_KEY } from '@/constants'

export interface IDoc {
  id: string
  title: string
  parentId: string | null
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
  isStar?: boolean
  sharePassword: string | null
  userId?: string
}

interface IOtherDoc {
  id: string
  title: string
}

interface IDocsState {
  loading: boolean
  docs: IDoc[]
  curDocId: string
  creating: boolean // is creating a new doc
  otherDocs: IOtherDoc[]
  setLoading: (loading: boolean) => void
  setDocs: (list: IDoc[]) => void
  addDoc: (doc: IDoc) => void
  removeDoc: (id: string) => void
  updateDocIsStar: (id: string, isStar: boolean) => void
  updateDocTitle: (id: string, title: string) => void
  updateDocSharePassword: (id: string, sharePassword: string | null) => void
  setCurDocId: (id: string) => void
  setCreating: (creating: boolean) => void
  setOtherDocs: (docs: IOtherDoc[]) => void
  addOtherDoc: (doc: IOtherDoc) => void
  removeOtherDoc: (id: string) => void
}

export const useDocsStore = create<IDocsState>((set) => ({
  loading: true,
  docs: [],
  curDocId: '',
  creating: false,
  otherDocs: [],
  setLoading: (loading) => set({ loading }),
  setDocs: (docs) => set({ docs }),
  addDoc: (doc) => set((state) => ({ docs: [...state.docs, doc] })),
  removeDoc: (id) =>
    set((state) => ({ docs: state.docs.filter((i) => i.id !== id) })),
  updateDocIsStar: (id, isStar) =>
    set((state) => ({
      docs: state.docs.map((i) => (i.id === id ? { ...i, isStar } : i)),
    })),
  updateDocTitle: (id, title) =>
    set((state) => ({
      docs: state.docs.map((i) => (i.id === id ? { ...i, title } : i)),
    })),
  updateDocSharePassword: (id, sharePassword) =>
    set((state) => ({
      docs: state.docs.map((i) => (i.id === id ? { ...i, sharePassword } : i)),
    })),
  setCurDocId: (curDocId) => set({ curDocId }),
  setCreating: (creating) => set({ creating }),
  setOtherDocs: (docs) => set({ otherDocs: docs }),
  addOtherDoc: (doc) =>
    set((state) => {
      let newDocs = state.otherDocs
      const alreadyHas = state.otherDocs.find((i) => i.id === doc.id)
      if (!alreadyHas) {
        newDocs = [...state.otherDocs, doc]
      }
      localStorage.setItem(SHARE_DOC_LIST_KEY, JSON.stringify(newDocs)) // store in localStorage
      return { otherDocs: newDocs }
    }),
  removeOtherDoc: (id) =>
    set((state) => {
      const newDocs = state.otherDocs.filter((i) => i.id !== id)
      localStorage.setItem(SHARE_DOC_LIST_KEY, JSON.stringify(newDocs)) // store in localStorage
      return { otherDocs: newDocs }
    }),
}))
