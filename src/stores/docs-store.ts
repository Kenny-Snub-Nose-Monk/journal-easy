import { create } from 'zustand'

export interface IDoc {
  id: string
  title: string
  parentId: string | null
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
  isStar?: boolean
  userId?: string
}

interface IDocsState {
  loading: boolean
  docs: IDoc[]
  curDocId: string
  creating: boolean // is creating a new doc
  setLoading: (loading: boolean) => void
  setDocs: (list: IDoc[]) => void
  addDoc: (doc: IDoc) => void
  removeDoc: (id: string) => void
  updateDocIsStar: (id: string, isStar: boolean) => void
  updateDocTitle: (id: string, title: string) => void
  setCurDocId: (id: string) => void
  setCreating: (creating: boolean) => void
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
  setCurDocId: (curDocId) => set({ curDocId }),
  setCreating: (creating) => set({ creating }),
}))
